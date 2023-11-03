<script setup lang="js">
const content = (await $fetch(`https://${publicServer.value}/api/v1/instance/extended_description`)).content
const instance = await useMastoClient().v2.instance.fetch()

const { t } = useI18n()

const subtitle = t('about.subtitle')
const administered_by = t('about.administered_by')
const contact = t('about.contact', [`<a href="mailto:${instance.contact.email}">${instance.contact.email}</a>`])
const server_rules = t('about.server_rules')
const footer_about = t('about.footer_about')
const footer_profiles_directory = t('about.footer_privacy_notice')
const footer_privacy_notice = t('about.footer_privacy_notice')
const footer_terms_of_service = t('about.footer_terms_of_service')
const footer_content_policy = t('about.footer_content_policy')
const footer_copyright_policies = t('about.footer_copyright_policies')
const footer_view_code = t('about.footer_view_code', [instance.version])
</script>

<template>
  <div p-x-5 sm:p-0>
    <div m-b-5>
      <img rounded-4 :src="instance.thumbnail.url">
      <h1 text-2xl p-y-2>
        {{ instance.title }}
      </h1>
      <h2>{{ subtitle }}</h2>
    </div>

    <div m-b-5 b-t-1px p-t-5>
      <div p-b-2>
        {{ administered_by }}
      </div>

      <AccountCard :account="instance.contact.account" />

      <div p-t-2 class="content-rich" v-html="contact" />
    </div>

    <div m-b-5 b-t-1px p-t-5 class="content-rich" v-html="content" />

    <div m-b-5 b-t-1px>
      <h2 text-2xl p-t-5 p-b-5>
        {{ server_rules }}
      </h2>

      <ul v-for="rule in instance.rules" :key="rule.id">
        <li list-disc m-l-5>
          {{ rule.text }}
        </li>
      </ul>
    </div>

    <div m-b-5 b-t-1px p-t-5>
      <NuxtLink underline p-r-6 href="/about">
        {{ footer_about }}
      </NuxtLink>
      <NuxtLink underline p-r-6 href="https://mozilla.social/directory">
        {{ footer_profiles_directory }}
      </NuxtLink>
      <NuxtLink underline p-r-6 href="https://mozilla.social/privacy-policy">
        {{ footer_privacy_notice }}
      </NuxtLink>
      <NuxtLink underline p-r-6 href="https://mozilla.social/terms">
        {{ footer_terms_of_service }}
      </NuxtLink>
      <NuxtLink underline p-r-6 href="https://www.mozilla.org/about/governance/policies/social-content-policies/">
        {{ footer_content_policy }}
      </NuxtLink>
      <NuxtLink underline p-r-6 href="https://www.mozilla.org/about/legal/report-infringement/">
        {{ footer_copyright_policies }}
      </NuxtLink>
    </div>

    <div flex b-t-1px>
      <NuxtLink underline p-t-6 p-b-6 :href="instance.source_url">
        {{ footer_view_code }}
      </NuxtLink>
    </div>
  </div>
</template>
