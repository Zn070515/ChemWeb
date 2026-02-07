<script setup>
import '../assets/extension.css'
</script>

<template>
  <h1 id="extension_title">拓展知识</h1>
  <div id="extension_description">
    <p>整理竞赛与高考拓展内容，帮助理解核心概念与难点。</p>
  </div>
  <div id="extension_content">
    <div class="extension_card">
      <h3>竞赛重点</h3>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/structural-chemistry">结构化学拓展</RouterLink>
        </h4>
      </div>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/redox-electrochemistry">氧化还原 + 电化学</RouterLink>
        </h4>
      </div>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/organic-chemistry">有机化学拓展</RouterLink>
        </h4>
      </div>
    </div>
    <RouterLink class="extension_card is-link" to="/extension/reading">
      <h3>拓展阅读</h3>
      <p>前沿化学与生活应用案例。</p>
    </RouterLink>
    <div class="extension_card">
      <h3>高考题型（持续更新）</h3>
      <p>高考题目解题思路与模板。</p>
    </div>
    <div class="extension_card">
      <h3>实验拓展</h3>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/lab-industry/instruments-standards">仪器与规范</RouterLink>
        </h4>
      </div>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/lab-industry/basic-operations">基本操作</RouterLink>
        </h4>
      </div>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/lab-industry/ions-gases-tests">离子与气体检验</RouterLink>
        </h4>
      </div>
      <div class="extension_section">
        <h4>
          <RouterLink class="extension_link" to="/extension/lab-industry/gas-prep-purify-collect">气体制备、除杂与收集</RouterLink>
        </h4>
      </div>
    </div>
  </div>
</template>
