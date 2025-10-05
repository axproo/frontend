<template>
    <div id="preloader">
        <div id="status">
            <div class="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>{{ t('loader') }}
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const {t} = useI18n();
</script>