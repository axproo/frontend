<template>
    <div class="leftside-menu">
        <!-- logo -->
         <router-link to="/" class="logo text-center logo-light">
            <span v-if="logos" v-for="(logo, idx) in logos" :key="idx" :class="logo.class">
                <img :src="logo.src" alt="logo" :class="logo.imgClass">
            </span>
         </router-link>

         <div class="h-100" id="leftside-menu-container" data-simplebar data-leftbar-compact-mode>
            <!-- Sidebar menu -->
            <ul class="side-nav" id="sidebar-accordion">
                
            </ul>

            <!-- Help box -->
            <div class="help-box text-white text-center">
                <router-link to="#" class="float-end close-btn text-white">
                    <i class="mdi mdi-close"></i>
                </router-link>
                <img :src="help_icon" alt="Help Center" height="90">
                <h5 class="mt-3">{{ t('access.limited') }}</h5>
                <p class="mb-3">{{ t('access.upgrade') }}</p>
                <router-link to="#" class="btn btn-secondary btn-sm">{{ t('button.upgrade') }}</router-link>
            </div>
            <div class="clearfix"></div>
         </div>
    </div>
</template>

<script setup>
import { useConfigStore } from '@/stores/ConfigStore';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const configs = useConfigStore();
const logos = computed(() => configs.siteLogo);
const help_icon = computed(() => configs.help_icon);

onMounted(() => {
    configs.init();
})
</script>

<style scoped>
.leftside-menu {
    background-color: #003366 !important;
}

.logo-circle {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
}

.side-nav a {
    text-decoration: none !important;
    color: white !important;
    transition: color 0.3s ease;
}

.side-nav a.side-nav-link:hover {
    text-decoration: none !important;
    color: #4a90e2 !important;
}

.menuitem-active {
    border-left: 0px solid #4a90e2;
}

.menuitem-active > a {
    color: #40c4a6 !important;
}
</style>