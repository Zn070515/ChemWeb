<script setup>
import { onMounted } from 'vue'
import '../assets/elements.css'

onMounted(() => {
  import('../modules/elements.js')
})
</script>

<template>
  <h1 id="elements_title">元素性质速查</h1>
  <div id="elements_description">
    <p>汇总常见元素的结构、性质与用途，便于快速查找与对比。</p>
  </div>
  <div id="periodic_table" aria-label="元素周期表"></div>
</template>
