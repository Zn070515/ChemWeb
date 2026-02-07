<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '../assets/chemdoodle.css'

const status = ref('正在加载 ChemDoodle ...')
const sketcher = ref(null)
const hostRef = ref(null)

const CDN_STYLE = '/chemdoodle/ChemDoodleWeb.css'
const CDN_SCRIPT = '/chemdoodle/ChemDoodleWeb.js'
const CDN_UIS_SCRIPT = '/chemdoodle/ChemDoodleWeb-uis.js'
let resizeHandler = null

const loadStyle = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = resolve
    link.onerror = () => reject(new Error('ChemDoodle CSS 加载失败'))
    document.head.appendChild(link)
  })
}

const loadScript = (src) => {
  if (document.querySelector(`script[src="${src}"]`)) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('ChemDoodle 脚本加载失败'))
    document.head.appendChild(script)
  })
}

const getCanvasSize = () => {
  const host = hostRef.value
  const width = host ? Math.max(320, host.clientWidth) : 900
  const height = Math.max(520, Math.round(window.innerHeight * 0.65))
  return { width, height }
}

const initSketcher = () => {
  if (!window.ChemDoodle) {
    throw new Error('ChemDoodle 未初始化')
  }
  if (typeof window.ChemDoodle.SketcherCanvas !== 'function') {
    throw new Error('ChemDoodle UI 组件未加载')
  }
  const { width, height } = getCanvasSize()
  const instance = new window.ChemDoodle.SketcherCanvas(
    'chemdoodle-sketcher',
    width,
    height,
    {}
  )
  instance.styles.atoms_useJMOLColors = true
  instance.styles.bonds_width_2D = 1.2
  instance.styles.atoms_displayTerminalCarbonLabels_2D = true
  instance.repaint()
  sketcher.value = instance
}

const resizeSketcher = () => {
  if (!sketcher.value) {
    return
  }
  const { width, height } = getCanvasSize()
  if (typeof sketcher.value.resize === 'function') {
    sketcher.value.resize(width, height)
  } else if (sketcher.value.canvas) {
    sketcher.value.canvas.width = width
    sketcher.value.canvas.height = height
    sketcher.value.repaint?.()
  }
}

const clearSketcher = () => {
  if (!sketcher.value) {
    status.value = '编辑器尚未就绪。'
    return
  }
  if (typeof sketcher.value.clear === 'function') {
    sketcher.value.clear()
    return
  }
  if (window.ChemDoodle?.Molecule) {
    sketcher.value.loadMolecule(new window.ChemDoodle.Molecule())
  }
}

const getMolfile = () => {
  if (!sketcher.value) {
    return ''
  }
  const mol = sketcher.value.getMolecule?.()
  if (!mol) {
    return ''
  }
  if (typeof window.ChemDoodle?.writeMOL === 'function') {
    return window.ChemDoodle.writeMOL(mol)
  }
  if (typeof mol.toMolfile === 'function') {
    return mol.toMolfile()
  }
  return ''
}

const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const exportMolfile = () => {
  const molfile = getMolfile()
  if (!molfile) {
    status.value = '当前分子为空，无法导出 MOL。'
    return
  }
  downloadText('structure.mol', molfile)
  status.value = '已导出 MOL 文件。'
}

const copyMolfile = async () => {
  const molfile = getMolfile()
  if (!molfile) {
    status.value = '当前分子为空，无法复制 MOL。'
    return
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(molfile)
    status.value = 'MOL 已复制到剪贴板。'
    return
  }
  status.value = '当前浏览器不支持剪贴板复制。'
}

onMounted(async () => {
  try {
    await loadStyle(CDN_STYLE)
    await loadScript(CDN_SCRIPT)
    await loadScript(CDN_UIS_SCRIPT)
    initSketcher()
    status.value = ''
  } catch (error) {
    status.value = error?.message || 'ChemDoodle 初始化失败。'
  }

  resizeHandler = () => resizeSketcher()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<template>
  <section class="chemdoodle-page">
    <h1 class="chemdoodle-title">化学结构式编辑器</h1>
    <p class="chemdoodle-subtitle">使用 ChemDoodle Web Components 免费版绘制与导出结构式。</p>
    <div class="chemdoodle-panel">
      <div class="chemdoodle-toolbar">
        <button type="button" class="chemdoodle-btn" @click="clearSketcher">清空</button>
        <button type="button" class="chemdoodle-btn" @click="exportMolfile">导出 MOL</button>
        <button type="button" class="chemdoodle-btn" @click="copyMolfile">复制 MOL</button>
      </div>
      <div ref="hostRef" class="chemdoodle-canvas">
        <canvas id="chemdoodle-sketcher"></canvas>
      </div>
      <p v-if="status" class="chemdoodle-status">{{ status }}</p>
      <p class="chemdoodle-hint">
        注意：免费版默认提供 2D 编辑能力；如需更高级的 3D 功能，请使用 ChemDoodle 官方扩展。
      </p>
    </div>
  </section>
</template>
