<script setup lang="ts">
import type { Recommendation } from '../composables/recommendations'
import { engagement, impression } from '~~/telemetry/generated/ui'
import { engagementDetails } from '~~/telemetry/engagementDetails'

const {
  item,
} = defineProps<{
  item: Recommendation
}>()

function recordEngagement(gleanId) {
  engagement.record({
    ui_identifier: gleanId,
    recommendation_id: item.id,
    ...engagementDetails[gleanId],
  })
}

function recordImpression() {
  impression.record({
    ui_identifier: 'discover.recommendation.impression',
    recommendation_id: item.id,
  })
}

const target = ref<HTMLDivElement>()
const { isActive } = useIntersectionObserver(target, checkIntersection, { threshold: 0.5 })

function checkIntersection([{ isIntersecting }]: [{ isIntersecting: boolean }]): void {
  if (isIntersecting && isActive.value) {
    recordImpression()
    isActive.value = false
  }
}

const clipboard = useClipboard()
async function copyLink(url: string): void {
  if (url) {
    await clipboard.copy(url)
    recordEngagement('discover.recommendation.share')
  }
}
</script>

<template>
  <NuxtLink ref="target" :to="item.url" target="_blank" external mt-5 p-x-8px flex @click="recordEngagement('discover.recommendation.open')">
    <div class="content" w-full pr>
      <h4 text-sm text-secondary>
        {{ item.publisher }}
      </h4>
      <h3 text-lg line-height-tight font-500 m-y-4px>
        {{ item.title }}
      </h3>
      <p>
        {{ item.excerpt }}
      </p>
    </div>
    <div class="media" relative overflow-hidden max-w-120px min-w-120px>
      <img :src="item.image.sizes?.[0]?.url" rounded-lg overflow-hidden w-full ha>
    </div>
  </NuxtLink>
  <div flex flex-justify-end p-3 border="b base">
    <CommonDropdown flex-none ms3 placement="bottom">
      <button flex gap-1 items-center w-full rounded op75 text-xl hover="op100 text-purple" group aria-label="Share actions">
        <div rounded-5 p2 elk-group-hover="bg-purple/10">
          <div i-mi:share />
        </div>
      </button>
      <template #popper>
        <div flex="~ col">
          <CommonDropdownItem
            :text="$t('menu.copy_link')"
            icon="i-ri:link"
            @click="copyLink(item.url)"
          />
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>

<style scoped>
a:hover h3 {
  text-decoration: underline;
}
p {
  line-height: 1.6em;
  max-height: 4.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
