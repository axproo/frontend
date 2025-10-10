<template>
    <Preloader v-if="isPreloader"/>
    <AuthLayout>
        <SpinnerUi v-if="isLoading" />
        <template v-else>
            <h3 class="text-center mb-4">{{ t('login.connect') }}</h3>

            <AlertUi :is-alert="forms.isAlert" :message="msg" :type="alert" />
            <form v-if="forms.isReady" @submit.prevent="submitForm" autocomplete="off">
                <DynamicForm />
                <div class="d-grid gap-2">
                    <ButtonUi v-if="button" :btn-show="button.is_active" :type="button.type"
                        :btn-text="(button.lang) ? t(`button.${button.lang}`) : ''" :btn-class="button.class"
                        :btn-action="button.action" :show-icon="true" :icon-class="button.icon" :is-submit="forms.isSubmit" />
                </div>
                <p class="text-center mt-3">
                    <router-link to="/password" class="link-secondary">
                        {{ t('login.passwd_forgot') }}
                    </router-link>
                </p>
            </form>
        </template>
    </AuthLayout>
</template>

<script setup>
import DynamicForm from '@/components/forms/DynamicForm.vue';
import AlertUi from '@/components/ui/AlertUi.vue';
import ButtonUi from '@/components/ui/ButtonUi.vue';
import Preloader from '@/components/ui/Preloader.vue';
import SpinnerUi from '@/components/ui/SpinnerUi.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useButtonStore } from '@/stores/ButtonStore';
import { useFormStore } from '@/stores/FormStore';
import { wait } from '@/utils/formUtils';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const forms = useFormStore();
const router = useRouter();
const auth = useAuthStore();

const button = ref({});
const buttons = useButtonStore();

const isPreloader = ref(false);
const isLoading = ref(false);
const msg = ref(null);
const alert = ref('info');

const submitForm = async () => {

    try {
        const response = await forms.submitForm()
        const { data: { query: { redirect } = {}, message } = {}} = response;

        msg.value = message;
        alert.value = 'success';

        await wait(2000);
        msg.value = t('login.redirect');
        alert.value = 'info';

        await wait(2000);
        isPreloader.value = true;
        forms.resetForm();
        await auth.login(router, redirect);

    } catch (error) {
        msg.value = error.message || error;
        alert.value = 'danger'
    }
}

const loadFormView = async () => {
    isLoading.value = true;
    forms.redirect = router;

    try {
        await forms.fieldData('/login');
        button.value = buttons.lists?.find(b => b.action === 'signin') || {};
    } catch (error) {
        forms.isAlert = true;
        msg.value = error.message || error;
        alert.value = 'danger'
    } finally {
        forms.isAlert = false;
        isLoading.value = false;
    }
}

onMounted(async () => {
    await loadFormView();
})
</script>