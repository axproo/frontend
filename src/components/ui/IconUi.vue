<template>
    <i v-show="iconShow" :class="iconClass"></i>
</template>

<script setup>

const props = defineProps({
    iconShow: {type: Boolean, default: false},
    iconClass: {type: String, default: 'mdi mdi-content-save'}
})
</script>