<script setup lang="ts">
import type { Recommendation } from '../composables/recommendations'
import { getLanguageForRecs } from '../../utils/language'

const { locale: lang } = useI18n()
const locale = getLanguageForRecs(lang.value)

const recommendations: Recommendation[] = await $fetch(`/api/${publicServer.value}/recommendations?locale=${locale}`)

// Shorten a string to less than maxLen characters without truncating words.
function shorten(str: string, maxLen: number): string {
  if (str.length <= maxLen)
    return str
  return `${str.slice(0, str.lastIndexOf(' ', maxLen))}...`
}

// This is temporary untill we are able to fetch from the new endpoint
function updateUTM(url: string): string {
  return url.replace('pocket-newtab', 'mozilla')
}
</script>

<template>
  <h1 text-2xl p-2>
    Today’s Top Picks
  </h1>
  <main>
    <template v-for="item in recommendations" :key="item.tileId">
      <NuxtLink
        :to="updateUTM(item.url)"
        target="_blank"
        external
        p-y-16px
        p-x-8px
        flex
        border="b base"
      >
        <div class="content" w-full pr>
          <h4 text-sm text-secondary>
            {{ item.publisher }}
          </h4>
          <h3 text-lg line-height-tight font-500 m-y-4px>
            {{ shorten(item.title, 100) }}
          </h3>
          <p>
            {{ shorten(item.excerpt, 140) }}
          </p>
        </div>
        <div class="media" relative overflow-hidden max-w-120px min-w-120px>
          <img :src="item.imageUrl" rounded-lg overflow-hidden w-full ha>
        </div>
      </NuxtLink>
    </template>
  </main>
</template>

<style scoped>
  a:hover h3 {
    text-decoration: underline;
  }
</style>
