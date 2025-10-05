<template>
  <div class="text-center">
    <div class="spinner-border spinner-border-sm spinner-border-avatar-sm text-primary" role="status"></div>
  </div>
  <div class="text-center text-muted">{{ text }}</div>
</template>

<script setup>
const props = defineProps({
    text: {type: String, default: import.meta.env.VITE_APP_SITE}
})
</script>
