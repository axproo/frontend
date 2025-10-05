<template>
    <AuthLayout>
        {{ link_page }}
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import { computed } from 'vue';

const link_page = computed(() => import.meta.env.VITE_API_BASE_URL)
</script>