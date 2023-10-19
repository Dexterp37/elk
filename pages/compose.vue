<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.compose'),
})

const publishSnackbar = ref(null)

function onPublish() {
  publishSnackbar.value.show()
}
</script>

<template>
  <PublishWidgetFull @published="onPublish" />
  <PublishSnackbar ref="publishSnackbar" />
</template>
