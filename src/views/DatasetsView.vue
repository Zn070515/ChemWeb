<script setup>
import '../assets/datasets.css'
</script>

<template>
  <section class="datasets-page">
    <h1 class="datasets-title">实用性表速查</h1>
    <p class="datasets-subtitle">快速进入常用化学数据集，支持表格/卡片/图表视图切换（即将上线）。</p>
    <div class="datasets-grid">
      <RouterLink class="datasets-card" to="/datasets/solubility">
        <h3>溶解度表</h3>
        <p>不同温度下的溶解度数据与溶解性规则。</p>
      </RouterLink>
      <RouterLink class="datasets-card" to="/datasets/acidity">
        <h3>酸强度表</h3>
        <p>pKa 数据与共轭酸碱对速查。</p>
      </RouterLink>
      <RouterLink class="datasets-card" to="/datasets/electrode-potentials">
        <h3>电极电势表</h3>
        <p>标准电极电势与氧化还原趋势。</p>
      </RouterLink>
      <RouterLink class="datasets-card" to="/datasets/constants">
        <h3>化学常数表</h3>
        <p>常用化学物理常数与单位信息。</p>
      </RouterLink>
    </div>
  </section>
</template>
