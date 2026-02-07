<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const go = (path) => {
  router.push(path)
}
</script>

<template>
  <h1 id="top_title">欢迎来到 ChemWeb，高中化学学习平台！</h1>
  <div id="discription">
    <p>ChemWeb 是一个专为高中生设计的化学学习平台，旨在帮助学生更好地理解化学概念、提升实验技能，并为高考做好准备。</p>
    <p>在这里，你可以找到丰富的学习资源，以及一些常用的化学学习工具。</p>
    <p>有任何问题或建议，欢迎通过邮箱联系我：302025510036@zjut.edu.cn</p>
    <p>
      GitHub:
      <a href="https://github.com/Zn070515/ChemWeb" target="_blank" rel="noopener noreferrer">
        https://github.com/Zn070515/ChemWeb
      </a>
    </p>
    <p>本平台由浙江工业大学本科 2025 级电气工程及其自动化专业 徐昕开发维护，转载、二创等行为请注明出处。</p>
  </div>
  <div id="features">
    <h2>平台特色</h2>
    <ul>
      <li>全面的化学课程覆盖高中所有章节</li>
      <li>元素性质速查</li>
      <li>式量计算与方程式配平</li>
      <li>化学结构式编辑器</li>
      <li>拓展知识</li>
    </ul>
  </div>
  <div id="sections">
    <div id="section_1" @click="go('/knowledge')">
      <h3>高中知识速览</h3>
      <p>针对高中书本内容的整理</p>
    </div>
    <div id="section_2" @click="go('/calculation')">
      <h3>化学式量计算与配平</h3>
      <p>支持式量计算与化学方程式配平。</p>
    </div>
    <div id="section_3" @click="go('/elements')">
      <h3>元素性质速查</h3>
      <p>快速查看元素性质、原子结构与常见用途。</p>
    </div>
    <div id="section_4" @click="go('/extension')">
      <h3>拓展知识</h3>
      <p>补充竞赛与高考中的重难点内容。</p>
    </div>
    <div id="section_5" @click="go('/ketcher')">
      <h3>化学结构式编辑器</h3>
      <p>基于 ChemDoodle Web Components 的结构式绘制与导出。</p>
    </div>
  </div>
</template>
