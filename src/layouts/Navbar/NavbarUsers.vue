<template>
    <li class="dropdown notification-list">
        <a href="" class="nav-link dropdown-toggle nav-user arrow-none me-0" data-bs-toggle="dropdown" role="button" aria-haspopup="false" aria-expanded="false">
            <span class="account-user-avatar">
                <img src="/assets/images/users/avatar-1.jpg" alt="user-image" class="rounded-circle">
            </span>
            <span>
                <span class="account-user-name">{{ fullname }}</span>
                <span class="account-position">{{ role }}</span>
            </span>
        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
            <div class="dropdown-header noti-title">
                <h6 class="text-overflow m-0">{{ t('welcome') }}</h6>
            </div>

            <button type="button" class="dropdown-item notify-item" @click.prevent="logout">
                <i class="mdi mdi-logout me-1"></i>
                <span>{{ t('logout.close') }}</span>
            </button>
        </div>
    </li>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();

const fullname = ref(auth.users?.fullname);
const role = ref(auth.users?.role || auth.users?.email)

const logout = async () => {
    router.push('/logout');
}
</script>