<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  newer,
  withAction = true,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  newer?: mastodon.v1.Status
  withAction?: boolean
}>()

// I took this from stackoverflow
function insertString(str, index, value) {
  return str.substr(0, index) + value + str.substr(index)
}

function hack(content) {
  let copy = content
  const regex = new RegExp('<a href', 'gi')
  for (const index of [...copy.matchAll(regex)].map(a => a.index).reverse())
    copy = insertString(copy, index, '<a data-glean="post.link.tap" href')
  return copy
}

const { translation } = useTranslation(status, getLanguageCode())

const emojisObject = useEmojisFallback(() => status.emojis)
const vnode = $computed(() => {
  if (!status.content)
    return null
  const vnode = contentToVNode(hack(status.content), {
    emojis: emojisObject.value,
    mentions: 'mentions' in status ? status.mentions : undefined,
    markdown: true,
    collapseMentionLink: !!('inReplyToId' in status && status.inReplyToId),
    status: 'id' in status ? status : undefined,
    inReplyToStatus: newer,
  })
  return vnode
})
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="line-compact" :content="translation.text" :emojis="status.emojis" />
      <div v-else text-red-4>
        Error: {{ translation.error }}
      </div>
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
