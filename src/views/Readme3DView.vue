<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import '../assets/readme-doc.css'
import readme3d from '../../backend-rdkit/README-3D.md?raw'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

const rendered = computed(() => md.render(readme3d))
</script>

<template>
  <section class="readme-doc">
    <h1 class="readme-doc__title">3D 预览环境说明</h1>
    <p class="readme-doc__subtitle">以下内容来自 backend-rdkit/README-3D.md。</p>
    <div class="readme-doc__content" v-html="rendered"></div>
  </section>
</template>
