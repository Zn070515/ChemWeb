<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import '../assets/chemdoodle.css'

const status = ref('正在加载 ChemDoodle ...')
const previewStatus = ref('')
const sketcher = ref(null)
const hostRef = ref(null)
const viewerRef = ref(null)
const show3dPreview = ref(false)
let viewer3d = null

const CDN_STYLE = '/chemdoodle/ChemDoodleWeb.css'
const CDN_SCRIPT = '/chemdoodle/ChemDoodleWeb.js'
const CDN_UIS_SCRIPT = '/chemdoodle/ChemDoodleWeb-uis.js'
const CDN_3DMOL_SCRIPT = '/3dmol/3Dmol-min.js'
const API_BASE = import.meta.env.VITE_3D_API_BASE || ''
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

const ensure3dViewer = async () => {
  if (!viewerRef.value) {
    throw new Error('3D 预览容器未就绪')
  }
  if (!window.$3Dmol) {
    await loadScript(CDN_3DMOL_SCRIPT)
  }
  if (!window.$3Dmol) {
    throw new Error('3Dmol.js 加载失败')
  }
  if (!viewer3d) {
    viewer3d = window.$3Dmol.createViewer(viewerRef.value, {
      backgroundColor: 'white'
    })
  }
}

const render3dMol = async (sdf) => {
  await ensure3dViewer()
  viewer3d.removeAllModels()
  viewer3d.addModel(sdf, 'sdf')
  viewer3d.setStyle({}, { stick: { radius: 0.18 }, sphere: { scale: 0.28 } })
  viewer3d.zoomTo()
  viewer3d.render()
}

const generate3dPreview = async () => {
  const molfile = getMolfile()
  if (!molfile) {
    previewStatus.value = '当前分子为空，无法生成 3D 结构。'
    return
  }
  show3dPreview.value = true
  previewStatus.value = '正在生成 3D 结构 ...'
  try {
    const response = await fetch(`${API_BASE}/api/3d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: molfile, format: 'mol' })
    })
    const rawText = await response.text()
    const payload = rawText ? JSON.parse(rawText) : null
    if (!response.ok) {
      throw new Error(payload?.error || '3D 生成失败')
    }
    if (!payload?.sdf) {
      throw new Error('未返回 3D 数据')
    }
    await render3dMol(payload.sdf)
    previewStatus.value = '3D 结构已生成，可拖拽旋转查看。'
  } catch (error) {
    previewStatus.value = error?.message || '3D 预览失败。'
  }
}

const close3dPreview = () => {
  show3dPreview.value = false
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
    <RouterLink class="chemdoodle-readme-link" to="/docs/3d-readme">
      3D 预览环境安装说明
    </RouterLink>
    <div class="chemdoodle-panel">
      <div class="chemdoodle-toolbar">
        <button type="button" class="chemdoodle-btn" @click="clearSketcher">清空</button>
        <button type="button" class="chemdoodle-btn" @click="exportMolfile">导出 MOL</button>
        <button type="button" class="chemdoodle-btn" @click="copyMolfile">复制 MOL</button>
        <button type="button" class="chemdoodle-btn" @click="generate3dPreview">生成 3D 结构</button>
      </div>
      <div ref="hostRef" class="chemdoodle-canvas">
        <canvas id="chemdoodle-sketcher"></canvas>
      </div>
      <p v-if="status" class="chemdoodle-status">{{ status }}</p>
      <p class="chemdoodle-hint">提示：3D 结构由后端生成，支持拖拽旋转与缩放查看。</p>
    </div>
    <div v-if="show3dPreview" class="chemdoodle-3d-overlay" @click.self="close3dPreview">
      <div class="chemdoodle-3d-panel" role="dialog" aria-modal="true">
        <button type="button" class="chemdoodle-3d-close" @click="close3dPreview">×</button>
        <h2 class="chemdoodle-3d-title">3D 构型预览</h2>
        <div ref="viewerRef" class="chemdoodle-3d-viewer"></div>
        <p v-if="previewStatus" class="chemdoodle-status">{{ previewStatus }}</p>
        <p class="chemdoodle-hint">
          若无法显示，请确认后端 3D 服务已启动，且可访问 `${API_BASE}/api/3d`。
        </p>
      </div>
    </div>
  </section>
</template>
