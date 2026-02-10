<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import '../assets/knowledge-detail.css'
import { loadLegacyHtml } from '../modules/legacy-html'

const route = useRoute()
const content = ref('')
const error = ref('')
const isLoading = ref(true)

const allowedSlugs = new Set([
  'compulsory-1',
  'compulsory-2',
  'elective-1',
  'elective-2',
  'elective-3'
])

const slug = computed(() => {
  const raw = route.params.slug
  if (Array.isArray(raw)) {
    return raw[0]
  }
  return raw
})

const legacyPath = computed(() => {
  if (!slug.value) {
    return ''
  }
  return `/legacy/knowledge/${slug.value}.html`
})

const loadContent = async () => {
  error.value = ''
  content.value = ''
  isLoading.value = true

  if (!slug.value || !allowedSlugs.has(slug.value)) {
    error.value = 'The requested topic is not available.'
    isLoading.value = false
    return
  }

  try {
    content.value = await loadLegacyHtml(legacyPath.value)
    await nextTick()
    const module = await import('../modules/knowledge-detail.js')
    module.setupTopicDetails?.()
  } catch (err) {
    error.value = 'Failed to load the content.'
  } finally {
    isLoading.value = false
  }
}

watch(() => slug.value, loadContent, { immediate: true })
</script>

<template>
  <div class="legacy-content">
    <p v-if="isLoading" class="legacy-loading">Loading...</p>
    <div v-else-if="error" class="legacy-error">
      <p>{{ error }}</p>
      <RouterLink to="/knowledge">Back to knowledge</RouterLink>
    </div>
    <div v-else v-html="content"></div>
  </div>
</template>
