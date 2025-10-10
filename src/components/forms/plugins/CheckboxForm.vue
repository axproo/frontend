<template>
    <input type="checkbox" :name="name" :id="name" :class="className" v-bind="attributes" :checked="isChecked"
        @change="onChange">
</template>

<script setup>
import { useFormStore } from '@/stores/FormStore';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const forms = useFormStore();
const route = useRoute();
const newRoute = ref(route.name);

const props = defineProps({
    name: { type: String, required: true },
    className: { type: String, required: false, default: 'form-check-input' },
    attributes: { type: Object, default: () => ({}) },
    modelValue: { type: [Boolean, Array, Number], required: true },
    value: { type: [Array, String], default: '' }
})
const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value)
    }
    return !!props.modelValue
})

const onChange = (event) => {
    let newVal;
    if (Array.isArray(props.modelValue)) {
        if (event.target.checked) {
            newVal = Array.from(new Set([...props.modelValue, props.value]))
        } else {
            newVal = props.modelValue.filter(item => item !== props.value)
        }
    } else {
        newVal = event.target.checked
    }
    emit('update:modelValue', newVal)
}

const updatedFieldSelect = (key, value) => {
    try {
        forms.updateField(newRoute.value, key, value);
    } catch (error) {
        console.log(error.message || error)
    }
}

watch(() => props.modelValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        updatedFieldSelect(props.name, newValue);
    }
});
</script>