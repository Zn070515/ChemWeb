<script setup>
import { computed, onMounted, ref } from 'vue'
import '../assets/datasets.css'

const acids = ref([])
const bases = ref([])
const generatedAt = ref('')
const loading = ref(true)
const error = ref('')
const query = ref('')

const normalizeDash = (value) => value.replace(/[–—]/g, '-')

const formatChemText = (value) => {
  if (!value) return '-'
  const normalized = normalizeDash(String(value))
  const parts = normalized.split(/(<[^>]+>)/g)
  return parts
    .map((part) => {
      if (part.startsWith('<')) return part
      let next = part
      next = next.replace(/(\b\d+[+-]\b)/g, '<sup>$1</sup>')
      next = next.replace(/([A-Za-z\)\]])(\d+)([+-])/g, '$1<sup>$2$3</sup>')
      next = next.replace(/([A-Za-z\)\]])([+-])(?!\d)/g, '$1<sup>$2</sup>')
      next = next.replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>')
      return next
    })
    .join('')
}

const compoundLabel = (entry) => entry.name || entry.formula || '-'
const shouldRenderName = (entry) => entry?.render !== false

const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, '')
    .toLowerCase()

const formatKaList = (values) => {
  if (!Array.isArray(values) || values.length === 0) return '-'
  return values
    .map((value, index) => `Ka${index + 1}=${String(value)}`)
    .join('<br>')
}

const formatScientificText = (value) => {
  if (!value) return '-'
  const normalized = String(value)
  return normalized.replace(/(\d+(?:\.\d+)?)e([+-]?\d+)/gi, '$1×10<sup>$2</sup>')
}

const filteredAcids = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return acids.value
  return acids.value.filter((entry) => {
    const haystack = [
      compoundLabel(entry),
      entry.formula,
      entry.source,
    ]
      .map(plainText)
      .join(' ')
    return haystack.includes(keyword)
  })
})

const filteredBases = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return bases.value
  return bases.value.filter((entry) => {
    const haystack = [
      compoundLabel(entry),
      entry.formula,
      entry.source,
    ]
      .map(plainText)
      .join(' ')
    return haystack.includes(keyword)
  })
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/data/pka_compiled.json')
    if (!response.ok) throw new Error('pKa 数据加载失败')
    const data = await response.json()
    acids.value = Array.isArray(data.acids) ? data.acids : []
    bases.value = Array.isArray(data.bases) ? data.bases : []
    generatedAt.value = data.generatedAt || ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'pKa 数据加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="datasets-page">
    <div class="datasets-header">
      <div>
        <h1 class="datasets-title">酸碱强度表</h1>
        <p class="datasets-subtitle">展示列出的酸 Ka 与碱 Kb 数据。</p>
      </div>
      <RouterLink class="datasets-back" to="/datasets">返回速查</RouterLink>
    </div>
    <div class="datasets-toolbar">
      <div class="datasets-search">
        <input v-model="query" type="text" placeholder="搜索酸名称 / 化学式" />
      </div>
      <div class="datasets-view-toggle">
        <button type="button" class="datasets-btn" disabled>表格</button>
        <button type="button" class="datasets-btn" disabled>卡片</button>
        <button type="button" class="datasets-btn" disabled>图表</button>
      </div>
    </div>
    <div class="datasets-meta">
      <span>酸：{{ filteredAcids.length }} | 碱：{{ filteredBases.length }}</span>
      <span v-if="generatedAt">更新时间：{{ generatedAt }}</span>
    </div>
    <div v-if="loading" class="datasets-status">正在加载数据...</div>
    <div v-else-if="error" class="datasets-status">{{ error }}</div>
    <div v-else>
      <h2 class="datasets-section-title">酸（Ka）</h2>
      <table class="datasets-table" v-if="filteredAcids.length">
        <thead>
          <tr>
            <th>酸</th>
            <th>Ka</th>
            <th>温度</th>
            <th>来源</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredAcids" :key="`acid-${index}`">
            <td>
              <span v-if="shouldRenderName(entry)" class="chem-html" v-html="formatChemText(compoundLabel(entry))" />
              <span v-else>{{ compoundLabel(entry) }}</span>
            </td>
            <td><span class="chem-html" v-html="formatScientificText(formatKaList(entry.kaValues))" /></td>
            <td>{{ entry.temperatureC === null || entry.temperatureC === undefined ? '-' : `${entry.temperatureC} ℃` }}</td>
            <td>{{ entry.source || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="datasets-empty">暂无酸的 Ka 数据。</div>

      <h2 class="datasets-section-title">碱（Kb）</h2>
      <table class="datasets-table" v-if="filteredBases.length">
        <thead>
          <tr>
            <th>碱</th>
            <th>Kb</th>
            <th>温度</th>
            <th>来源</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredBases" :key="`base-${index}`">
            <td>
              <span v-if="shouldRenderName(entry)" class="chem-html" v-html="formatChemText(compoundLabel(entry))" />
              <span v-else>{{ compoundLabel(entry) }}</span>
            </td>
            <td><span class="chem-html" v-html="formatScientificText(entry.kbValue || '-')" /></td>
            <td>{{ entry.temperatureC === null || entry.temperatureC === undefined ? '-' : `${entry.temperatureC} ℃` }}</td>
            <td>{{ entry.source || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="datasets-empty">暂无碱的 Kb 数据。</div>
    </div>
  </section>
</template>
