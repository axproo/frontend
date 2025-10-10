<template>
    <div class="navbar-custom">
        <!-- Manager configs -->
        <ul class="list-unstyled topbar-menu float-end mb-0">
            <!-- Search notification -->
            <NavbarSearch />

            <!-- User profile -->
            <NavbarUsers />
        </ul>

        <!-- mobile button -->
        <button class="button-menu-mobile open-left" @click="handleMode">
            <i class="mdi mdi-menu"></i>
        </button>

        <!-- Manage service -->
        <NavbarApps />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import NavbarApps from '../Navbar/NavbarApps.vue';
import NavbarSearch from '../Navbar/NavbarSearch.vue';
import NavbarUsers from '../Navbar/NavbarUsers.vue';

const { t } = useI18n();

const handleMode = () => {
    const body = document.body.classList.contains('sidebar-enable');
    if (body === false) {
        localStorage.setItem('compact', 'condensed');
    } else {
        localStorage.setItem('compact', '');
    }
}

onMounted(async () => {
    
})
</script>