<template>
  <PageWrapper>
    {{ $t('pages.logoff.logging') }}
  </PageWrapper>
</template>

<script setup lang="ts">
const router = useRouter()

definePageMeta({
  layout: 'page',
})

const { logout } = useStrapiAuth()

onMounted(async () => {
  await logout()
  router.push('/')
})
</script>
