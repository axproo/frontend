<template>
    <AuthLayout>
        <SpinnerUi v-if="isLoading" />
        <template v-else>
            <h4 class="text-center mb-2">{{ t('otp.title') }}</h4>
            <p class="text-center mb-2" v-if="!isEmail">
                <span v-html="maskedEmail"></span>
                <span class="d-block mb-0">{{ t('otp.empty') }}</span>

                <a href="javascript:;" class="text-decoration-underline" v-if="!isResend && resendTimer === 0"
                    @click.prevent="handleButton('code')">
                    <IconUi :icon-show="true" icon-class="mdi mdi-qrcode"/> {{ t('otp.resend') }}
                </a>
                <template v-else-if="resendTimer > 0">
                    <span class="text-primary">
                        {{ t('otp.retry_in', { minutes: Math.floor(resendTimer / 60), seconds: resendTimer % 60 }) }}
                    </span>
                </template>
                <template v-else>
                    <span class="spinner-border spinner-border-sm me-1 text-primary" role="status" aria-hidden="true"></span>
                    <span class="text-primary">{{ t('otp.progress') }}</span>
                </template>
            </p>

            <AlertUi :is-alert="isAlert" :message="msg" :type="alert"/>
            <form v-if="forms.isReady" @submit.prevent="submitForm" autocomplete="off">
                <DynamicForm />
                <div class="d-grid gap-2">
                    <ButtonUi v-if="button" v-for="btn in button" :key="btn.name" :btn-show="btn.is_active"
                        :type="btn.type" :btn-text="(btn.lang) ? t(`button.${btn.lang}`) : ''" :btn-class="btn.class"
                        :btn-action="btn.action" :show-icon="true" :icon-class="btn.icon" :is-submit="btn.is_submit"
                        @click.prevent="handleButton(btn.action)" :disabled="!isValidOtp"/>
                </div>
            </form>
        </template>
    </AuthLayout>
</template>

<script setup>
import DynamicForm from '@/components/forms/DynamicForm.vue';
import AlertUi from '@/components/ui/AlertUi.vue';
import ButtonUi from '@/components/ui/ButtonUi.vue';
import IconUi from '@/components/ui/IconUi.vue';
import SpinnerUi from '@/components/ui/SpinnerUi.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useButtonStore } from '@/stores/ButtonStore';
import { useDelayStore } from '@/stores/DelayStore';
import { useFormStore } from '@/stores/FormStore';
import { debounceUrl, wait } from '@/utils/formUtils';
import { showWarning } from '@/utils/toastr';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const forms = useFormStore();
const buttons = useButtonStore();
const router = useRouter();
const delays = useDelayStore();

const isLoading = ref(false);
const isEmail = ref(false)
const isAlert = ref(false);
const isSubmit = ref(false);
const isValidOtp = ref(false);
const msg = ref(null)
const alert = ref('info')

const newRoute = ref('/code')
const button = ref({})

const resendTimer = computed(() => delays.resendTimer);
const isResend = computed(() => delays.is_resend);

const email = localStorage.getItem('email');
const maskEmail = () => {
    if (!email) return;

    const [user, domain] = email.split('@');
    if (user.length <= 2) {
        return '*'.repeat(user.length) + '@' + domain
    }
    const first = user[0];
    const last = user[user.length - 2];
    const stars = '*'.repeat(user.length - 2)

    const newEmail = `<b class="d-block mt-0 mb-0">${first}${stars}${last}@${domain}</b>`;
    return t('otp.content', {email: newEmail})
}
const maskedEmail = maskEmail()

const handleButton = async (action) => {
    isAlert.value = false;

    const eventAction = {
        clear: async () => {
            updateButtons('clear')
            await loadFormView('email', email);
        },
        send: async () => {
            updateButtons('send');
            await submitForm()
        },
        code: async () => {
            delays.is_resend = true;
            if (!delays.canResend()) {
                showWarning(t('otp.wait', {minutes: 15}));
                delays.startCountdown();
                return;
            }
            forms.isUrl = '/otp-resend'
            localStorage.setItem('otp_last_sent', Date.now().toString());
            await submitForm()
            delays.startCountdown()
        }
    }

    const actions = eventAction[action];
    if (typeof actions === 'function') {
        await actions()
    } else {
        showWarning(t('Actions.not_defined', {act: action}))
    }
}

const updateButtons = (clickedAction = null) => {
    button.value.forEach(async b => {
        b.is_submit = (b.action === clickedAction)
        b.is_active = ['send', 'clear'].includes(b.action) ? !isEmail.value : isEmail.value
    })
}

const submitForm = async () => {
    isAlert.value = false

    try {
        const response = await forms.submitForm();
        
        if (response) {
            const { data : { message } = {}, formData: { email, code } = {}} = response;

            try {
                delays.is_resend = false;
                isAlert.value = true;
                msg.value = message;
                alert.value = 'success';

                if (forms.isUrl === '/otp-resend') {
                    await wait(3000)
                    await loadFormView('email', email);
                    isSubmit.value = false;
                    return;
                }
                if (forms.isUrl === '/otp-check') {
                    await wait(2000);
                    msg.value = t('login.redirect');
                    alert.value = 'info';

                    await wait(2000)
                    localStorage.clear();
                    router.push('/')
                }
            } catch (error) {
                errorShow(error);
            }
        }
    } catch (error) {
        errorShow(error);
        delays.is_resend = false
    } finally {
        updateButtons();
    }
}

const errorShow = (error) => {
    isAlert.value = true
    msg.value = error.message || error
    alert.value = 'danger'
}

const loadFormView = async (key, value) => {
    forms.resetOtpCode();
    isAlert.value = false
    const url = await debounceUrl(newRoute.value, '', key, value)
    
    try {
        await forms.fieldData(url);
        button.value = buttons.lists.filter(b => ['send','email-verify','clear'].includes(b.action)) || {}
        button.value.is_active = button.value.forEach(b => {
            if (['send','clear'].includes(b.action)) {
                b.is_active = !isEmail.value
            } else {
                b.is_active = isEmail.value
            }
            b.is_submit = false;
        });
    } catch (error) {
        isAlert.value = true;
        msg.value = error.message || error;
        alert.value = 'danger'
    }
}
onMounted(async () => {
    await loadFormView('email', email);
    if (!delays.canResend()) {
        delays.is_resend = true;
        delays.startCountdown()
    }
});
watch(() => forms.isValidOtp, (newValid) => {
    isValidOtp.value = false;
    isValidOtp.value = newValid;
}, {immediate: true})
</script>