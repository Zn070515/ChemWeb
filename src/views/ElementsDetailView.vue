<script setup>
import { onMounted } from 'vue'
import '../assets/elements-detail.css'

onMounted(() => {
  import('../modules/elements-detail.js')
})
</script>

<template>
  <h1 id="detail_title">元素详情</h1>
  <div id="detail_description">
    <p>点击周期表元素后可查看其基础信息与常见性质。</p>
  </div>
  <div id="detail_card"></div>
  <a id="detail_prev" class="detail_nav-arrow detail_nav-prev" href="#" aria-label="上一元素">&#x276E;</a>
  <a id="detail_next" class="detail_nav-arrow detail_nav-next" href="#" aria-label="下一元素">&#x276F;</a>
  <div id="detail_sections">
    <div class="detail_section">
      <h3>常见性质</h3>
      <div id="detail_properties"></div>
    </div>
    <div class="detail_section">
      <h3>元素拓展介绍</h3>
      <p id="detail_extension">暂无详细介绍，敬请期待。</p>
    </div>
    <div class="detail_section">
      <h3>学习提示</h3>
      <p id="detail_tips">建议结合教材与实验案例理解该元素的典型反应。</p>
    </div>
  </div>
  <RouterLink id="back_link" to="/elements">返回周期表</RouterLink>
</template>
