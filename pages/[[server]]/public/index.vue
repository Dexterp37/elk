<script setup lang="ts">

const { t } = useI18n()

import { view } from '../../../glean/timeline';

useHydratedHead({
  title: () => t('title.federated_timeline'),
})

onMounted(() => {
  view.record();
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:earth-line />
        <span>{{ t('title.federated_timeline') }}</span>
      </NuxtLink>
    </template>

    <TimelinePublic v-if="isHydrated" />
  </MainContent>
</template>
