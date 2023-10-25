<script setup lang="ts">
import type { mastodon } from 'masto'
import { toggleBlockAccount, toggleBlockDomain, toggleMuteAccount } from '~~/composables/masto/relationship'
import { engagement } from '~~/telemetry/generated/ui'
import { engagementDetails } from '~~/telemetry/engagementDetails'

const { account } = defineProps<{
  account: mastodon.v1.Account
  command?: boolean
}>()
const emit = defineEmits<{
  (evt: 'addNote'): void
  (evt: 'removeNote'): void
}>()

let relationship = $(useRelationship(account))

const isSelf = $(useSelfAccount(() => account))
const notLocal = $computed(() => getServerName(account) !== currentServer.value)

const { t } = useI18n()
const { client } = $(useMasto())
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')
const { share, isSupported: isShareSupported } = useShare()

function recordEngagement(dataGlean: string) {
  engagement.record({
    ui_identifier: dataGlean,
    mastodon_account_id: account.id,
    mastodon_account_handle: account.acct,
    ...engagementDetails[dataGlean],
  })
}

function shareAccount() {
  recordEngagement('profile.more.share-account')
  share({ url: location.href })
}

async function toggleReblogs() {
  if (!relationship!.showingReblogs) {
    if (await openConfirmDialog({
      title: t('confirm.show_reblogs.title', [account.acct]),
      confirm: t('confirm.show_reblogs.confirm'),
      cancel: t('confirm.show_reblogs.cancel'),
    }) !== 'confirm')
      return
    recordEngagement('profile.more.show-boosts')
  }
  else {
    recordEngagement('profile.more.hide-boosts')
  }

  const showingReblogs = !relationship?.showingReblogs
  relationship = await client.v1.accounts.follow(account.id, { reblogs: showingReblogs })
}

async function addUserNote() {
  recordEngagement('profile.more.add-note')
  emit('addNote')
}

async function removeUserNote() {
  recordEngagement('profile.more.remove-note')

  if (!relationship!.note || relationship!.note.length === 0)
    return

  const newNote = await client.v1.accounts.createNote(account.id, { comment: '' })
  relationship!.note = newNote.note
  emit('removeNote')
}

function report() {
  recordEngagement('profile.more.report.open')
  openReportDialog(account)
}
</script>

<template>
  <CommonDropdown :eager-mount="command">
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group aria-label="More actions" data-glean="profile.more.open">
      <div rounded-5 p2 elk-group-hover="bg-purple/10">
        <div i-ri:more-2-fill />
      </div>
    </button>

    <template #popper>
      <NuxtLink v-if="notLocal" :to="account.url" external target="_blank">
        <CommonDropdownItem
          is="button"
          :text="$t('menu.open_in_original_site')"
          icon="i-ri:arrow-right-up-line"
          :command="command"
          data-glean="profile.more.open-in-original-site"
        />
      </NuxtLink>
      <CommonDropdownItem
        is="button"
        v-if="isShareSupported"
        :text="`Share @${account.acct}`"
        icon="i-ri:share-line"
        :command="command"
        @click="shareAccount()"
      />

      <template v-if="currentUser">
        <template v-if="!isSelf">
          <CommonDropdownItem
            is="button"
            :text="$t('menu.mention_account', [`@${account.acct}`])"
            icon="i-ri:at-line"
            :command="command"
            @click="mentionUser(account, 'profile.more.mention')"
          />
          <CommonDropdownItem
            is="button"
            :text="$t('menu.direct_message_account', [`@${account.acct}`])"
            icon="i-ri:message-3-line"
            :command="command"
            @click="directMessageUser(account, 'profile.more.direct-message')"
          />

          <CommonDropdownItem
            is="button"
            v-if="!relationship?.showingReblogs"
            icon="i-ri:repeat-line"
            :text="$t('menu.show_reblogs', [`@${account.acct}`])"
            :command="command"
            @click="toggleReblogs()"
          />
          <CommonDropdownItem
            is="button"
            v-else
            :text="$t('menu.hide_reblogs', [`@${account.acct}`])"
            icon="i-ri:repeat-line"
            :command="command"
            @click="toggleReblogs()"
          />

          <CommonDropdownItem
            is="button"
            v-if="!relationship?.note || relationship?.note?.length === 0"
            :text="$t('menu.add_personal_note', [`@${account.acct}`])"
            icon="i-ri-edit-2-line"
            :command="command"
            @click="addUserNote()"
          />
          <CommonDropdownItem
            is="button"
            v-else
            :text="$t('menu.remove_personal_note', [`@${account.acct}`])"
            icon="i-ri-edit-2-line"
            :command="command"
            @click="removeUserNote()"
          />

          <CommonDropdownItem
            is="button"
            v-if="!relationship?.muting"
            :text="$t('menu.mute_account', [`@${account.acct}`])"
            icon="i-ri:volume-mute-line"
            :command="command"
            @click="toggleMuteAccount (relationship!, account, 'profile.more.mute')"
          />
          <CommonDropdownItem
            is="button"
            v-else
            :text="$t('menu.unmute_account', [`@${account.acct}`])"
            icon="i-ri:volume-up-fill"
            :command="command"
            @click="toggleMuteAccount (relationship!, account, 'profile.more.unmute')"
          />

          <CommonDropdownItem
            is="button"
            v-if="!relationship?.blocking"
            :text="$t('menu.block_account', [`@${account.acct}`])"
            icon="i-ri:forbid-2-line"
            :command="command"
            @click="toggleBlockAccount (relationship!, account, 'profile.more.block')"
          />
          <CommonDropdownItem
            is="button"
            v-else
            :text="$t('menu.unblock_account', [`@${account.acct}`])"
            icon="i-ri:checkbox-circle-line"
            :command="command"
            @click="toggleBlockAccount (relationship!, account, 'profile.more.unblock')"
          />

          <template v-if="getServerName(account) !== currentServer">
            <CommonDropdownItem
              is="button"
              v-if="!relationship?.domainBlocking"
              :text="$t('menu.block_domain', [getServerName(account)])"
              icon="i-ri:shut-down-line"
              :command="command"
              @click="toggleBlockDomain(relationship!, account, 'profile.more.block-domain')"
            />
            <CommonDropdownItem
              is="button"
              v-else
              :text="$t('menu.unblock_domain', [getServerName(account)])"
              icon="i-ri:restart-line"
              :command="command"
              @click="toggleBlockDomain(relationship!, account, 'profile.more.unblock-domain')"
            />
          </template>

          <CommonDropdownItem
            is="button"
            :text="$t('menu.report_account', [`@${account.acct}`])"
            icon="i-ri:flag-2-line"
            :command="command"
            @click="report()"
          />
        </template>

        <template v-else>
          <NuxtLink to="/pinned">
            <CommonDropdownItem is="button" :text="$t('account.pinned')" icon="i-ri:pushpin-line" :command="command" data-glean="profile.more.goto-pinned" />
          </NuxtLink>
          <NuxtLink to="/favourites">
            <CommonDropdownItem is="button" :text="$t('account.favourites')" :icon="useStarFavoriteIcon ? 'i-ri:star-line' : 'i-ri:heart-3-line'" :command="command" data-glean="profile.more.goto-favorites" />
          </NuxtLink>
          <NuxtLink to="/mutes">
            <CommonDropdownItem is="button" :text="$t('account.muted_users')" icon="i-ri:volume-mute-line" :command="command" data-glean="profile.more.goto-mutes" />
          </NuxtLink>
          <NuxtLink to="/blocks">
            <CommonDropdownItem is="button" :text="$t('account.blocked_users')" icon="i-ri:forbid-2-line" :command="command" data-glean="profile.more.goto-blocks" />
          </NuxtLink>
          <NuxtLink to="/domain_blocks">
            <CommonDropdownItem is="button" :text="$t('account.blocked_domains')" icon="i-ri:shut-down-line" :command="command" data-glean="profile.more.goto-domain-blocks" />
          </NuxtLink>
        </template>
      </template>
    </template>
  </CommonDropdown>
</template>
