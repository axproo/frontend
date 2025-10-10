<template>
  <Preloader v-if="isLoading"/>
  <router-view v-else />
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Preloader from './components/ui/Preloader.vue';
import { useBodyStore } from './stores/BodyStore';
import { useRoute } from 'vue-router';
import { wait } from './utils/formUtils';

const {t} = useI18n();
const body = useBodyStore();
const route = useRoute();

const app_name = inject('app_name');
const isLoading = ref(false);

const loadPage = async () => {
  

  body.setBody({
    classes: `show ${localStorage.getItem('compact') === 'condensed' ? 'sidebar-enable' : ''}`,
    title: `${route?.meta?.headline || route?.name || 'Introuvable'} - ${app_name}`,
    description: t('site_description'),
    author: import.meta.env.VITE_APP_SITE,
    attributes: {
      ...body.dataAttributes,
      'leftbar-compact-mode': localStorage.getItem('compact') ?? ''
    }
  })
  localStorage.setItem('sess_require', route.meta.auth_require)
}

onMounted(async () => {
  isLoading.value = true
  await loadPage()

  await wait(1500);
  isLoading.value = false
})

watch(() => route?.fullPath, async () => {
  await loadPage();
})
</script>
