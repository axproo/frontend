<template>
    <button v-show="btnShow" :class="btnClass" :type="btnType" :disabled="isSubmit" @click="emitAction">
        <template v-if="!isSubmit && !isLink">
            <IconUi :icon-show="showIcon" :icon-class="iconClass"/> {{ btnText }}
        </template>
        <template v-else-if="isSubmit && !isLink">
            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> {{ t('loader') }}
        </template>
        <template v-else>
            <IconUi :icon-show="showIcon" :icon-class="iconClass"/> {{ btnText }}
        </template>
    </button>
</template>

<script setup>
import { useFormStore } from '@/stores/FormStore';
import { computed } from 'vue';
import IconUi from './IconUi.vue';
import { useI18n } from 'vue-i18n';

const forms = useFormStore();
const {t} = useI18n();

const props = defineProps({
    btnShow: {type: Boolean, default: true},
    btnClass: {type: String, default: 'btn btn-primary'},
    btnType: {type: String, default: 'save'},
    isSubmit: {type: Boolean, default: false},
    btnAction: String,
    btnPayload: {type: [String, Number]},
    showIcon: {type: Boolean, default: false},
    iconClass: String,
    btnText: {type: String, default: 'save'}
})

const emit = defineEmits(['action']);
const emitAction = () => {
    emit('action', {action: props.btnAction, payload: props.btnPayload})
}

const isLink = computed(() => forms.isUrl === '/auth/otp/send');
</script>