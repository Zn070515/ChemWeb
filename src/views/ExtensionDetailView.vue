<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import '../assets/extension.css'
import { loadLegacyHtml } from '../modules/legacy-html'

const route = useRoute()
const content = ref('')
const error = ref('')
const isLoading = ref(true)

const routeMap = {
  'structural-chemistry': 'extension-knowledge/structural-chemistry/structural-chemistry.html',
  'redox-electrochemistry': 'extension-knowledge/redox-electrochemistry/redox-electrochemistry.html',
  'organic-chemistry': 'extension-knowledge/organic-chemistry/organic-chemistry.html',
  'lab-industry/instruments-standards': 'extension-knowledge/lab-industry/instruments-standards.html',
  'lab-industry/basic-operations': 'extension-knowledge/lab-industry/basic-operations.html',
  'lab-industry/ions-gases-tests': 'extension-knowledge/lab-industry/ions-gases-tests.html',
  'lab-industry/gas-prep-purify-collect': 'extension-knowledge/lab-industry/gas-prep-purify-collect.html',
  reading: 'extension-reading.html'
}

const slug = computed(() => {
  const raw = route.params.pathMatch
  if (Array.isArray(raw)) {
    return raw.join('/')
  }
  return raw
})

const legacyPath = computed(() => {
  if (!slug.value || !routeMap[slug.value]) {
    return ''
  }
  return `/legacy/extension/${routeMap[slug.value]}`
})

const loadContent = async () => {
  error.value = ''
  content.value = ''
  isLoading.value = true

  if (!legacyPath.value) {
    error.value = 'The requested topic is not available.'
    isLoading.value = false
    return
  }

  try {
    content.value = await loadLegacyHtml(legacyPath.value)
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
      <RouterLink to="/extension">Back to extension</RouterLink>
    </div>
    <div v-else v-html="content"></div>
  </div>
</template>
