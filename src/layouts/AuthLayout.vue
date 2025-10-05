<template>
  <div class="login-page">
    <div class="theme-toggle">
      <ButtonUi
        v-if="button"
        v-for="(btn, idx) in button"
        :key="idx"
        :btn-action="btn.action"
        :btn-class="btn.class"
        :btn-text="btn.lang"
        @action="handleAction(btn.action)"
      />
    </div>
    <div :class="['login-container', isDark ? 'dark' : 'light']">
      <div class="logo-circle">
        <img src="/assets/images/logo500.png" alt="logo" />
      </div>
      <slot></slot>
    </div>
  </div>
  <FooterLayout />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import FooterLayout from './FooterLayout.vue'
import { useBodyStore } from '@/stores/BodyStore'
import { useButtonStore } from '@/stores/ButtonStore'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ButtonUi from '@/components/ui/ButtonUi.vue'
import { showError } from '@/utils/toastr'

const { t, locale } = useI18n()
const route = useRoute()
const body = useBodyStore()
const button = ref({})
const buttons = useButtonStore()

const isDark = ref(false)
const isLang = ref(true) // true = fr, false = en

const handleAction = async (action) => {
    const btn = button.value.find((b) => b.action === action);
    if (!btn || !btn.value) {
        showError(t('Actions.not_defined', {act: action}));
    }
    const values = btn.value.split(',').map((v) => v.trim());

    const eventAction = {
        theme: () => {
            isDark.value = !isDark.value;
            const theme = isDark.value ? values[0] : values[1];
            localStorage.setItem('theme', theme);
        },
        lang: () => {
            isLang.value = !isLang.value;
            const lang = isLang.value ? values[0] : values[1];
            localStorage.setItem('lang', lang);
            locale.value = lang;
        }
    }
    const actions = eventAction[action];
    if (typeof actions === 'function') {
        await actions();
        updateButtonText();
    } else {
        showError(t('Actions.not_defined', {act: action}));
    }
}

const applyAuthLayout = async () => {
  body.setBody({
    classes: '',
  })
  await buttons.fetchButtons()
  button.value = buttons.lists.filter((b) => ['theme', 'lang'].includes(b.action)) || {};
}

const updateButtonText = () => {
  button.value.forEach(b => {
    if (!b.value) return;
    const values = b.value.split(',').map((v) => v.trim())

    if (b.action === 'theme') {
      const match = isDark.value ? values[1] : values[0]
      b.lang = t(`button.${match}`)
    } else if (b.action === 'lang') {
      const match = isLang.value ? values[1].toUpperCase() : values[0].toUpperCase()
      b.lang = match
    } else {
      b.lang = t(`button.${b.lang}`)
    }
  })
}

onMounted(async () => {
  await applyAuthLayout()
  const saved = localStorage.getItem('theme')
  if (saved) isDark.value = saved === 'dark'

  const savedLang = localStorage.getItem('lang')
  if (savedLang) {
    isLang.value = savedLang.toLocaleLowerCase() === 'fr'
    locale.value = isLang.value ? 'fr' : 'en'
  }
  updateButtonText()
})

watch(
  () => route.name,
  async (newName) => {
    if (['login', 'register'].includes(newName)) {
      await applyAuthLayout()
    }
  },
)
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
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
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
  color: #dcdcdc;
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
