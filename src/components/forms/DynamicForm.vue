<template>
    <!-- Champs hidden -->
    <InputForm v-for="field in filteredFields.hidden" :key="field.name" v-bind="inputProps(field)"
        :model-value="formData[field.name]" />

    <!-- Définition des Champs -->
    <div v-for="field in filteredFields.visible" :key="field.name" :class="['mb-3', field.form_group]">
        <!-- label -->
        <label :for="field.name" v-if="field.isLabel && field.type !== 'checkbox'" :class="classLabel">
            {{ field.label }}
            <small v-if="field.required && route.path !== '/login'" class="text-danger me-1">*</small>
            <span v-show="field.legend" class="badge badge-outline-info">{{ field.legend }}</span>
        </label>

        <!-- Champs checkbox -->
        <div v-if="field.type === 'checkbox'" :class="checkBoxClass">
            <CheckboxForm :key="field.name" v-bind="inputProps(field)" :model-value="[1,'1',true,'true'].includes(formData[field.name])" @change="(e) => handleInput(field, e)"/>
            <label :for="field.name" class="form-check-label" v-html="field.label"></label>
        </div>

        <!-- Composant de Champs -->
        <component :is="getComponentForField(field)" v-bind="inputProps(field)" :modelValue="inputFormData(field)"
            @input="(e) => !(field.type !== 'select' || field.type !== 'multiple') ? handleInput(field, e) : null"
            @update:modelValue="(e) => handleInput(field, e)"
            @pasteText="(e) => field.type === 'editor' ? handlePasteText(field, e) : null" />
        
        <div v-if="errors[field.name]" class="text-danger errors">{{ errors[field.name] }}</div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import InputForm from './plugins/InputForm.vue';
import { useFormStore } from '@/stores/FormStore';
import { useRoute } from 'vue-router';
import CheckboxForm from './plugins/CheckboxForm.vue';
import { kebabCase, camelCase } from 'lodash';
import { showError } from '@/utils/toastr';
import OtpForm from './plugins/OtpForm.vue';

const props = defineProps({
    classLabel: { type: String, default: 'form-label' },
    checkBoxClass: { type: String, default: 'form-check' }
})
const emit = defineEmits(['update:modelValue', 'clearForm']);

const forms = useFormStore();
const route = useRoute();

const formData = computed(() => forms.formData);
const errors = computed(() => forms.errors);

const isReadonlyHandled = ref(false);

const filteredFields = computed(() => {
    const { fields } = forms
    return {
        hidden: Object.values(fields).filter(f => f.type === 'hidden'),
        visible: Object.values(fields).filter(f => f.type !== 'hidden')
    }
})

const inputProps = field => ({
    name: field.name,
    type: field.type,
    placeholder: field.placeholder,
    autocomplete: `c${field.name}`,
    attributes: field.attributes,
    readonly: field.is_read_only || field.isReadOnly,
    multiple: field.type === 'multiple',
    legend: field.legend,
    options: Object.entries(field.option_values || {}).map(([id, label]) => ({ id, label })),
    ...(field.type !== 'select' && field.type !== 'multiple' ? { type: field.type } : {}),
    class: [field.class, errors.value[field.name] ? 'is-invalid' : ''].filter(Boolean).join(' ')
})

const getComponentForField = field => {
    switch (field.type) {
        case 'password': case 'text': return InputForm;
        case 'code': return OtpForm;
        default: showError(`Aucun champs défini pour ${field.type}`)
        // default: return field.type !== 'checkbox' && field.type !== 'code' ? InputForm : null
    }
}

const inputFormData = field => {
    const fieldValue = formData.value[field.name];
    if (['select', 'multiple'].includes(field.type)) {
        return fieldValue ?? Object.keys(field.option_values || {})[0] ?? '';
    }
    return fieldValue ?? '';
}

const handlePasteText = (field, event) => {
    if (formData.value[field.name] !== event) {
        formData.value[field.name] = event;
        emit('update:modelValue', {key: field.name, value: event});
    }
    forms.validateField(field, event, field.required)
}

const handleInput = (field, event) => {
    let newValue;

    if (event && typeof event === 'object' && event.target) {
        switch (field.type) {
            case 'checkbox':
                newValue = event.target.checked;
                break;
            case 'editor':
                newValue = event.target.innerHTML;
                break;

            default:
                newValue = event.target.value
                break;
        }
    } else {
        newValue = event;
    }

    if (formData.value[field.name] !== newValue) {
        formData.value[field.name] = newValue;
        emit('update:modelValue', { key: field.name, value: newValue });
    }
    forms.validateField(field, newValue, field.required);
    updatedPageUrl()
}

const updatedPageUrl = () => {
    const pageTitle = formData.value.page_title || '';
    const title = route.name !== 'Menus' ? kebabCase(pageTitle) : camelCase(pageTitle);

    const parentId = formData.value.parent_id;
    const parentName = parentId ? Object.values(forms.fields).find(f => f.name === 'parent_id')?.option_values?.[parentId]?.toLowerCase() : '';

    formData.value.slug = parentId ? `/${parentName}/${title}` : (title === 'dashboard' ? '/' : `/${title}`);
    handleReadonlyFields();
}

const handleReadonlyFields = () => {
    if (isReadonlyHandled.value) return;
    isReadonlyHandled.value = true;

    nextTick(() => {
        Object.values(forms.fields).filter(f => f.is_readonly).forEach(field => {
            const val = formData.value[field.name];
            if (val) {
                emit('update:modelValue', { key: field.name, value: val });
            }
        })
    })
}

onMounted(() => updatedPageUrl())

watch(() => forms.fields, () => {
    isReadonlyHandled.value = false;
    nextTick(handleReadonlyFields);
}, { immediate: true})

watch(() => formData.value, () => {
    isReadonlyHandled.value = false;
    nextTick(handleReadonlyFields);
}, { deep: true})
</script>

<style scoped>
.is-invalid {
    border: 1px solid red !important;
    background-color: #ffe5e5 !important;
}

.opacity-btn {
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.pointer-events-none {
    pointer-events: none;
    cursor: not-allowed;
}

.errors {
    text-align: left !important;
    color: red
}
</style>