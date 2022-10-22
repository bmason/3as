<script lang="ts" setup>
import { capitalize } from '~/utils/str'

const { x, y } = useMouse()

// composable
const { t } = useLang()

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: capitalize(t('pages.blank.title')),
  meta: [
    {
      name: 'description',
      content: t('pages.blank.description'),
    },
  ],
}))
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.blank.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <div>pos: {{x}}, {{y}}</div>
        <div v-for="i in 30" :key="i" class="text-6xl uppercase">
          {{ $t('pages.blank.just_blank_page_with_title') }}
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
