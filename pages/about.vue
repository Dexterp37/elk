<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.about.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/about" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <span>{{ t('settings.about.label') }}</span>
      </NuxtLink>
    </template>

    <SettingsAbout v-if="isHydrated" />
  </MainContent>
</template>
