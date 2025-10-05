<template>
    <AuthLayout>
        <SpinnerUi v-if="isLoading" />
        <template v-else>
            <h3 class="text-center mb-4">{{ t('login.connect') }}</h3>

            <AlertUi :is-alert="isAlert" :message="msg" :type="alert" />
            <form v-if="forms.isReady" @submit.prevent="submitForm" autocomplete="off">
                <DynamicForm />
                <div class="d-grid gap-2">
                    <ButtonUi v-if="button" :btn-show="button.is_active" :type="button.type"
                        :btn-text="(button.lang) ? t(`button.${button.lang}`) : ''" :btn-class="button.class"
                        :btn-action="button.action" :show-icon="true" :icon-class="button.icon" :is-submit="isSubmit" />
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
import SpinnerUi from '@/components/ui/SpinnerUi.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useButtonStore } from '@/stores/ButtonStore';
import { useFormStore } from '@/stores/FormStore';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const forms = useFormStore();

const button = ref({});
const buttons = useButtonStore();

const isLoading = ref(false);
const isAlert = ref(false);
const isSubmit = ref(false);
const msg = ref(null);
const alert = ref('info');

const submitForm = async () => {
    console.log('submit form');
}

const loadFormView = async () => {
    isLoading.value = true;

    try {
        await forms.fieldData('/login');
        button.value = buttons.lists?.find(b => b.action === 'signin') || {};
    } catch (error) {
        isAlert.value = true;
        msg.value = error.message || error;
        alert.value = 'danger'
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await loadFormView();
})
</script>