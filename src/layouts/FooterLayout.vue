<template>
    <footer class="footer footer-alt">
        <span class="p-1">2019 - {{ currentYear }} © Cyberprotection Platform. {{ t('footer.copyright') }} </span>
        <a :href="websiteUrl" target="_blank">{{ websiteName }}</a>
    </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const {t} = useI18n();
const currentYear = new Date().getFullYear();
const websiteUrl = 'https://www.axproo.fr';
const websiteName = import.meta.env.VITE_APP_SITE;

</script>

<style scoped>
footer a {
    color: white;
    text-decoration: none;
}

footer a:hover {
    text-decoration: underline; /* optionnel pour UX */
}

</style>