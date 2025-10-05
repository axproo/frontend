<template>
    <div>
        <input ref="input" :type="type" :id="name" :name="name" :placeholder="placeholder" :autocomplete="autocomplete"
            v-bind="attributes" v-model="inputSearch" :readonly="readonly">
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';


const props = defineProps({
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    placeholder: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    attributes: { type: [Array, Object, String], required: false },
    modelValue: { type: [String, Array, Object, Number], default: '' },
    readonly: { type: Boolean, required: false, default: false }
})
const input = ref(null);
const emit = defineEmits(['update:modelValue']);

const inputSearch = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

defineExpose({
    focus: () => input.value?.focus(),
    contains: (element) => input.value?.contains(element)
})
</script>

<style lang="scss" scoped></style>