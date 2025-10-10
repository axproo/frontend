<template>
    <AuthLayout>
        <SpinnerUi v-if="isLoading"/>
        <template v-else>
            <h4 class="text-center mb-3">{{ t('email.verify.title') }}</h4>
            <p class="text-center mb-4">{{ t('email.verify.content') }}</p>

            <AlertUi :is-alert="isAlert" :message="msg" :type="alert"/>
            <form v-if="forms.isReady" @submit.prevent="submitForm" autocomplete="off">
                <DynamicForm />
                <div class="d-grid gap-2">
                    <ButtonUi v-if="button" :btn-show="button.is_active" :type="button.type"
                        :btn-text="(button.lang) ? t(`button.${button.lang}`) : ''" :btn-class="button.class"
                        :btn-action="button.action" :show-icon="true" :icon-class="button.icon" :is-submit="isSubmit" />
                </div>
                <p class="text-center mt-3">
                    <router-link to="/login" class="link-secondary">{{ t('login.connect') }}</router-link>
                </p>
            </form>
        </template>
    </AuthLayout>
</template>

<script setup>
import DynamicForm from '@/components/forms/DynamicForm.vue';
import AlertUi from '@/components/ui/AlertUi.vue';
import ButtonUi from '@/components/ui/ButtonUi.vue';
import SpinnerUi from '@/components/ui/SpinnerUi.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useButtonStore } from '@/stores/ButtonStore';
import { useFormStore } from '@/stores/FormStore';
import { wait } from '@/utils/formUtils';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const {t} = useI18n();
const forms = useFormStore();
const router = useRouter();
const button = ref({});
const buttons = useButtonStore();

const isLoading = ref(false);
const isAlert = ref(false);
const isSubmit = ref(false);
const msg = ref(null);
const alert = ref('info');

const submitForm = async () => {
    isAlert.value = false

    try {
        isSubmit.value = true;
        const response = await forms.submitForm();
        const data = response?.data
        
        if (data) {
            const {query: {email, redirect}, message} = data;

            isAlert.value = true;
            msg.value = message;
            alert.value = 'success'

            await wait(5000);
            isAlert.value = true;
            msg.value = t('wait');
            alert.value = 'info';

            await wait(2000);
            localStorage.setItem('email', email);
            router.push(redirect);
        }
    } catch (error) {
        isAlert.value = true;
        msg.value = error.message || error;
        alert.value = 'danger'
    }
}

const loadFormView = async () => {
    isLoading.value = true
    isAlert.value = false;

    try {
        await forms.fieldData('/verify')
        button.value = buttons.lists?.find(b => b.action === 'email-verify') || {};
    } catch (error) {
        isAlert.value = true;
        msg.value = error.message || error;
        alert.value = 'danger'
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => await loadFormView())
</script>