<template>
    <ErrorLayout>
        <div class="card-body p-4">
            <div class="text-center">
                <h1 class="text-error">
                    4<i class="mdi mdi-emoticon-sad"></i>4
                </h1>
                <h4 class="text-uppercase text-danger mt-3">{{ t('page.failed.not_found') }}</h4>
                <p class="text-muted mt-3">{{ t('page.failed.content') }} <br><b>{{ page }}</b></p>

                <router-link to="/" class="btn btn-primary mt-3">
                    <i class="mdi mdi-reply"></i> {{ t('button.goback') }}
                </router-link>
            </div>
        </div>
    </ErrorLayout>
</template>

<script setup>
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const page = computed(() => `Page : ${route.path}`);
</script>