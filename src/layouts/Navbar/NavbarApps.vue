<template>
    <ul class="list-unstyled topbar-menu mb-0">
        <li class="dropdown notification-list d-none d-sm-inline-block">
            <a href="#" class="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" role="button"
                aria-haspopup="false" aria-expanded="false">
                <i class="dripicons-view-apps noti-icon"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg p-0">
                <div class="p-2">
                    <div class="row g-0">
                        <div class="col-4" v-for="(app, idx) in apps" :key="idx">
                            <a :href="app.url" :class="app.class">
                                <img :src="`/assets/images/brands/${app.image}`" :alt="app.label">
                                <span>{{ app.name }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { useConfigStore } from '@/stores/ConfigStore';
import { showError } from '@/utils/toastr';
import { computed, onMounted } from 'vue';


const configs = useConfigStore();
const apps = computed(() => configs.services);

onMounted(async () => {
    try {
        await configs.fetchService()
    } catch (error) {
        showError(error.message || error);
    }
})
</script>