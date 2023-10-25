<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(false)

function show() {
  isVisible.value = true

  setTimeout(() => {
    hide()
  }, 10000)
}

function hide() {
  isVisible.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<template>
  <div class="snackbar-wrapper">
    <div
      :class="{ active: isVisible }"
      class="snackbar"
    >
      Your post was published
    </div>
  </div>
</template>

<style scoped>
  .snackbar-wrapper {
    display: flex;
    justify-content: center;
  }
  .snackbar {
    background: var(--c-primary);
    border-radius: 8px;
    border: 1px solid var(--c-primary-light);
    color: var(--c-text-base-light);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    min-width: 280px;
    opacity: 0;
    padding: 8px 16px;
    text-align: center;
    transition: opacity 800ms ease-in-out;
  }
  .snackbar.active {
    opacity: 1;
  }
</style>
