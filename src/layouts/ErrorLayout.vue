<template>
    <div class="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xxl-4 col-lg-5">
                    <div class="card">
                        <div class="card-header pt-4 pb-4 text-center bg-primary">
                            <a href="/" class="logo-dark">
                                <span class="logo-container">
                                    <img src="/assets/images/logo500.png" alt="logo" class="logo-img">
                                </span>
                            </a>
                        </div>
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterLayout />
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import FooterLayout from './FooterLayout.vue';
import { useBodyStore } from '@/stores/BodyStore';
import { useRoute } from 'vue-router';

const body = useBodyStore();
const route = useRoute();

const applyAuthLayout = () => {
    body.setBody({
        classes: `${body.classes} authentication-bg`,
        dataAttributes: {...body.dataAttributes, 'layout-config': '{"darkMode": true}'}
    });
}

const resetLayout = () => {
    body.setBody({
        classes: body.classes.replace('authentication-bg', '').trim(),
        dataAttributes: {...body.dataAttributes, 'layout-config': ''}
    })
}

onMounted(() => applyAuthLayout());

watch(() => route.name, (newName) => {
    if (newName === 'Error') applyAuthLayout();
})

onUnmounted(() => resetLayout());
</script>

<style scoped>
.logo-container {
    display: inline-block;
    overflow: hidden;
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>