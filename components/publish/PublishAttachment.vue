<script setup lang="ts">
import type { mastodon } from 'masto'

const props = withDefaults(defineProps<{
  attachment: mastodon.v1.MediaAttachment
  alt?: string
  removable?: boolean
  dialogLabelledBy?: string
}>(), {
  removable: true,
})

const emit = defineEmits<{
  (evt: 'remove'): void
  (evt: 'setDescription', description: string): void
}>()

// from https://github.com/mastodon/mastodon/blob/dfa984/app/models/media_attachment.rb#L40
const maxDescriptionLength = 1500

const isEditDialogOpen = ref(false)
const description = ref(props.attachment.description ?? '')
function toggleApply() {
  isEditDialogOpen.value = false
  emit('setDescription', unref(description))
}
</script>

<template>
  <div relative group>
    <StatusAttachment :attachment="attachment" w-full is-preview />
    <div absolute right-2 top-2>
      <div
        v-if="removable"
        :aria-label="$t('attachment.remove_label')"
        class="bg-black/75 hover:bg-red/75"
        text-white px2 py2 rounded-full cursor-pointer
        @click="$emit('remove')"
      >
        <div i-ri:close-line text-3 text-6 md:text-3 />
      </div>
    </div>
    <div absolute right-2 bottom-2>
      <button class="bg-black/75 plusalt" text-white px2 py1 rounded-2 @click="isEditDialogOpen = true">
        {{ $t('action.altplus') }}
      </button>
    </div>
    <ModalDialog
      v-model="isEditDialogOpen"
      :dialog-labelled-by="dialogLabelledBy"
      py-6
      px-6 max-w-300
    >
      <div flex flex-justify-end mb>
        <button btn-text p-0 @click="isEditDialogOpen = false">
          <div i-ri:close-line />
        </button>
      </div>
      <div flex flex-col-reverse gap-5 md:flex-row>
        <div flex flex-col gap-2 justify-between>
          <h1 id="edit-attachment" font-bold>
            {{ $t('attachment.edit_title') }}
          </h1>
          <div hidden md:block>
            <p mb-4>
              {{ $t('attachment.alt-text-p-1') }}
            </p>
            <p mb-4>
              {{ $t('attachment.alt-text-p-2') }}
            </p>
            <ul mb-4 list-disc list-inside>
              <li>{{ $t('attachment.alt-point-1') }}</li>
              <li>{{ $t('attachment.alt-point-2') }}</li>
              <li>{{ $t('attachment.alt-point-3') }}</li>
              <li>{{ $t('attachment.alt-point-4') }}</li>
              <li>{{ $t('attachment.alt-point-5') }}</li>
            </ul>
          </div>
          <div flex flex-col gap-2>
            <textarea v-model="description" p-3 h-50 bg-base rounded-2 border-strong border-1 w-full :placeholder="$t('attachment.add_image_description')" />
            <div flex flex-row-reverse>
              <PublishCharacterCounter :length="description.length" :max="maxDescriptionLength" />
            </div>
            <button class="apply-btn" btn-solid rounded-3 text-sm w-full :disabled="description.length > maxDescriptionLength" @click="toggleApply">
              {{ $t('action.apply') }}
            </button>
          </div>
        </div>
        <StatusAttachment :attachment="attachment" w-full is-preview />
      </div>
    </ModalDialog>
  </div>
</template>

<style>
  .plusalt {
    align-items: center;
    padding: 4px 16px;
    background: rgba(21, 20, 26, 0.8);
    border-radius: 360px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
  }

  .apply-btn {
    border-radius: 360px;
  }
</style>
