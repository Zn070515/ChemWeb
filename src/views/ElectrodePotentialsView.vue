<script setup>
import { computed, onMounted, ref } from 'vue'
import '../assets/datasets.css'

const entries = ref([])
const generatedAt = ref('')
const loading = ref(true)
const error = ref('')
const query = ref('')

const stripTags = (value) => String(value || '').replace(/<[^>]*>/g, '')

const filteredEntries = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return entries.value
  return entries.value.filter((entry) => entry.searchText.includes(keyword))
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/elements-data.json')
    if (!response.ok) throw new Error('电极电势数据加载失败')
    const data = await response.json()
    const elements = Array.isArray(data.elements) ? data.elements : []
    entries.value = elements
      .filter((element) => element.properties?.standardElectrodePotential && element.properties.standardElectrodePotential !== '-')
      .map((element) => {
        const potentialHtml = element.properties.standardElectrodePotential
        const searchText = [
          element.symbol,
          element.name,
          element.number,
          stripTags(potentialHtml),
        ]
          .join(' ')
          .toLowerCase()
        return {
          symbol: element.symbol,
          name: element.name,
          number: element.number,
          potentialHtml,
          searchText,
        }
      })
    generatedAt.value = data.generatedAt || ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : '电极电势数据加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="datasets-page">
    <div class="datasets-header">
      <div>
        <h1 class="datasets-title">电极电势表</h1>
        <p class="datasets-subtitle">展示标准电极电势与氧化还原序列。</p>
      </div>
      <RouterLink class="datasets-back" to="/datasets">返回速查</RouterLink>
    </div>
    <div class="datasets-toolbar">
      <div class="datasets-search">
        <input v-model="query" type="text" placeholder="搜索半反应 / 元素" />
      </div>
      <div class="datasets-view-toggle">
        <button type="button" class="datasets-btn" disabled>表格</button>
        <button type="button" class="datasets-btn" disabled>卡片</button>
        <button type="button" class="datasets-btn" disabled>图表</button>
      </div>
    </div>
    <div class="datasets-meta">
      <span>数据量：{{ filteredEntries.length }}</span>
      <span v-if="generatedAt">更新时间：{{ generatedAt }}</span>
    </div>
    <div v-if="loading" class="datasets-status">正在加载数据...</div>
    <div v-else-if="error" class="datasets-status">{{ error }}</div>
    <div v-else>
      <table class="datasets-table" v-if="filteredEntries.length">
        <thead>
          <tr>
            <th>元素</th>
            <th>半反应式 / E<sup>θ</sup></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEntries" :key="entry.symbol">
            <td>{{ entry.symbol }}（{{ entry.name }}）</td>
            <td><span class="chem-html" v-html="entry.potentialHtml" /></td>
          </tr>
        </tbody>
      </table>
      <div v-else class="datasets-empty">未找到匹配的数据。</div>
    </div>
  </section>
</template>
