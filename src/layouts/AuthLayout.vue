<template>
    <div class="login-page">
        <div class="theme-toggle">

        </div>
        <div :class="['login-container', isDark ? 'dark' : 'light']">
            <div class="logo-circle">
                <img src="/assets/images/logo500.png" alt="logo">
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const isDark = ref(false);
</script>

<style scoped>
/** Fond bleu AXPROO permanent */
.login-page {
    background-color: #003366;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    position: relative;
}

/** Switcher le theme */
.theme-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

/** Container principal */
.login-container {
    width: 100%;
    max-width: 400px;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease, color 0.3s ease;
}

/** Logo dans le cercle */
.logo-circle {
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 50%;
    margin: 0 auto 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.logo-circle img {
    width: auto;
    max-width: 90%;
    height: auto;
    max-height: 90%;
}

/** Mode clair et sombre */
.dark {
    background-color: #1e1e2f;
    color: #f1f1f1;
}

.dark .form-label,
.dark .link-secondary {
    color: #dcdcdc
}

.dark input.form-control {
    background-color: #2c2c3c;
    color: #ffffff;
    border-color: #444;
}

.light {
    background-color: #ffffff;
    color: #222;
}

.light .form-label,
.light .link-secondary {
    color: #333;
}
</style>