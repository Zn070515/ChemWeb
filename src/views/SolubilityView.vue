<script setup>
import { computed, onMounted, ref } from 'vue'
import '../assets/datasets.css'

const kspMatrix = ref({})
const cations = ref([])
const anions = ref([])
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

const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, '')
    .toLowerCase()

const filteredCations = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return cations.value
  return cations.value.filter((entry) => plainText(entry.label).includes(keyword))
})

const formatKsp = (value) => {
  if (!value) return ''
  const normalized = String(value).toLowerCase()
  const match = normalized.match(/^([0-9.]+)e([+-]?\d+)$/)
  if (!match) return normalized
  return `${match[1]}×10<sup>${match[2]}</sup>`
}

const cellLabel = (cell) => {
  if (!cell) return '-'
  const status = cell.solubility || '-'
  if (!cell.ksp) return status
  return `${status}<br>Ksp ≈ ${formatKsp(cell.ksp)}`
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/data/pka_compiled.json')
    if (!response.ok) throw new Error('溶解度数据加载失败')
    const data = await response.json()
    const kspData = data.ksp || {}
    cations.value = Array.isArray(kspData.cations) ? kspData.cations : []
    anions.value = Array.isArray(kspData.anions) ? kspData.anions : []
    kspMatrix.value = kspData.matrix || {}
    generatedAt.value = data.generatedAt || ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : '溶解度数据加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="datasets-page">
    <div class="datasets-header">
      <div>
        <h1 class="datasets-title">溶解度表</h1>
        <p class="datasets-subtitle">展示盐的溶解性与 Ksp（25℃优先）。</p>
      </div>
      <RouterLink class="datasets-back" to="/datasets">返回速查</RouterLink>
    </div>
    <div class="datasets-toolbar">
      <div class="datasets-search">
        <input v-model="query" type="text" placeholder="搜索化合物 / 化学式" />
      </div>
      <div class="datasets-view-toggle">
        <button type="button" class="datasets-btn" disabled>表格</button>
        <button type="button" class="datasets-btn" disabled>卡片</button>
        <button type="button" class="datasets-btn" disabled>图表</button>
      </div>
    </div>
    <div class="datasets-meta">
      <span>阳离子：{{ filteredCations.length }} | 阴离子：{{ anions.length }}</span>
      <span v-if="generatedAt">更新时间：{{ generatedAt }}</span>
    </div>
    <div v-if="loading" class="datasets-status">正在加载数据...</div>
    <div v-else-if="error" class="datasets-status">{{ error }}</div>
    <div v-else>
      <table class="datasets-table" v-if="filteredCations.length && anions.length">
        <thead>
          <tr>
            <th>阳离子\阴离子</th>
            <th v-for="anion in anions" :key="anion.symbol">
              <span class="chem-html" v-html="anion.label" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cation in filteredCations" :key="cation.symbol">
            <td><span class="chem-html" v-html="cation.label" /></td>
            <td v-for="anion in anions" :key="`${cation.symbol}-${anion.symbol}`">
              <span class="chem-html" v-html="cellLabel(kspMatrix[cation.symbol]?.[anion.symbol])" />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="datasets-empty">暂无 Ksp 数据。</div>
    </div>
  </section>
</template>
