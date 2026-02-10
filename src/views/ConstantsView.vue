<script setup>
import { computed, onMounted, ref } from 'vue'
import '../assets/datasets.css'

const sections = ref([])
const generatedAt = ref('')
const loading = ref(true)
const error = ref('')
const query = ref('')

const formatCell = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const normalized = String(value)
  const parts = normalized.split(/(<[^>]+>)/g)
  return parts
    .map((part) => {
      if (part.startsWith('<')) return part
      let next = part
      next = next.replace(/\^(-?\d+)/g, '<sup>$1</sup>')
      next = next.replace(/(\b\d+[+-]\b)/g, '<sup>$1</sup>')
      return next
    })
    .join('')
}

const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, '')
    .toLowerCase()

const filteredSections = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return sections.value
  return sections.value
    .map((section) => {
      if (section.type === 'table') {
        const rows = (section.rows || []).filter((row) =>
          row.some((cell) => plainText(cell).includes(keyword))
        )
        return { ...section, rows }
      }
      if (section.type === 'list') {
        const items = (section.items || []).filter((item) => plainText(item).includes(keyword))
        return { ...section, items }
      }
      return section
    })
    .filter((section) => {
      if (section.type === 'table') return section.rows && section.rows.length
      if (section.type === 'list') return section.items && section.items.length
      return true
    })
})

const totalCount = computed(() =>
  sections.value.reduce((sum, section) => {
    if (section.type === 'table') return sum + (section.rows?.length || 0)
    if (section.type === 'list') return sum + (section.items?.length || 0)
    return sum
  }, 0)
)

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/data/constants.json')
    if (!response.ok) throw new Error('常数数据加载失败')
    const data = await response.json()
    sections.value = Array.isArray(data.sections) ? data.sections : []
    generatedAt.value = data.generatedAt || ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : '常数数据加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="datasets-page">
    <div class="datasets-header">
      <div>
        <h1 class="datasets-title">化学常数表</h1>
        <p class="datasets-subtitle">展示常用化学物理常数（25℃优先）。</p>
      </div>
      <RouterLink class="datasets-back" to="/datasets">返回速查</RouterLink>
    </div>
    <div class="datasets-toolbar">
      <div class="datasets-search">
        <input v-model="query" type="text" placeholder="搜索常数名称 / 符号" />
      </div>
      <div class="datasets-view-toggle">
        <button type="button" class="datasets-btn" disabled>表格</button>
        <button type="button" class="datasets-btn" disabled>卡片</button>
        <button type="button" class="datasets-btn" disabled>图表</button>
      </div>
    </div>
    <div class="datasets-meta">
      <span>数据量：{{ totalCount }}</span>
      <span v-if="generatedAt">更新时间：{{ generatedAt }}</span>
    </div>
    <div v-if="loading" class="datasets-status">正在加载数据...</div>
    <div v-else-if="error" class="datasets-status">{{ error }}</div>
    <div v-else>
      <div v-if="filteredSections.length">
        <section v-for="(section, index) in filteredSections" :key="index" class="datasets-section">
          <h2 class="datasets-section-title">{{ section.title }}</h2>
          <table v-if="section.type === 'table'" class="datasets-table">
            <thead>
              <tr>
                <th v-for="(col, colIndex) in section.columns" :key="colIndex">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in section.rows" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  <span class="chem-html" v-html="formatCell(cell)" />
                </td>
              </tr>
            </tbody>
          </table>
          <ul v-else-if="section.type === 'list'" class="datasets-list">
            <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
              <span v-if="typeof item === 'string'" class="chem-html" v-html="formatCell(item)" />
              <span v-else class="chem-html" v-text="item.text || ''" />
            </li>
          </ul>
        </section>
      </div>
      <div v-else class="datasets-empty">暂无常数数据，请先导入。</div>
    </div>
  </section>
</template>
