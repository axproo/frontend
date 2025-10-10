<template>
    <div class="col" v-for="(digit, index) in digits" :key="index">
        <input ref="inputs" :type="type" inputmode="numeric" maxlength="1" :name="name" :id="name"
            :placeholder="placeholder" v-bind="attributes" :autocomplete="autocomplete"
            class="form-control text-center fs-4 p-2" v-model="digits[index]" @input="onInput($event, index)"
            @keydown="onKeydown($event, index)" @paste="onPaste($event)" pattern="[0-9]*">
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    name: { type: String, required: true },
    type: { type: String, required: true },
    placeholder: String,
    autocomplete: String,
    attributes: { type: [String, Object, Array], required: false },
    modelValue: {type: [String, Object, Array, Number], required: true},
    length: {type: Number, default: 6, required: false}
});

const emit = defineEmits(['update:modelValue', 'pasteText', 'input']);
const digits = ref(Array.from({ length: props.length}, (__, i) => props.modelValue[1] || ''));
const inputs = ref([]);

const onKeydown = (event, index) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    // Autoriser uniquement les chiffres (0-9)
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'Backspace') {
        if (!digits.value[index] && index > 0) {
            focusInput(index - 1);
        }
    } else if (event.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < props.length - 1) {
        focusInput(index + 1);
    }
}

const onInput = (event, index) => {
    const value = event.target.value.replace(/\D/g, '');

    if (value.length === 1) {
        digits.value[index] = value;
        if (index < props.length - 1) focusInput(index + 1)
    } else if (value.length > 1) {
        const values = value.split('').slice(0, props.length);
        values.forEach((v, i) => (digits.value[i] = v));

        emit('pasteText', values.join(''));
    }
}

const onPaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length) {
        event.preventDefault();
        pasted.split('').slice(0, props.length).forEach((v, i) => {
            digits.value[i] = v;
        })
        emit('pasteText', pasted);
        nextTick(() => focusInput(Math.min(pasted.length, props.length - 1)));
    }
}

const focusInput = (index) => {
    inputs.value[index]?.focus();
}

watch(() => digits.value, (val) => {
    const otp = val.join('');
    emit('update:modelValue', otp);
    emit('input', otp)
}, { deep: true });

watch(() => props.modelValue, (val) => {
    if (val !== digits.value.join('')) {
        digits.value = Array.from({
            length: props.length
        }, (_, i) => val[i] || '')
    }
});

defineExpose({
    focus: () => focusInput(0),
});
</script>

<style lang="scss" scoped></style>