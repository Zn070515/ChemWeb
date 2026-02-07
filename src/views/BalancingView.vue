<script setup>
import { onMounted } from 'vue'
import '../assets/balancing.css'

onMounted(() => {
  import('../modules/balancing.js')
})
</script>

<template>
  <h1 id="balancing_title">化学方程式配平</h1>
  <div id="balancing_description">
    <p>支持化学方程式与离子方程式配平，自动识别守恒元素与电荷。</p>
  </div>

  <div id="balancing_panel">
    <div id="balancing_palette">
      <h3>常见离子与分子</h3>
      <div class="species_group">
        <h4>分子</h4>
        <div id="species_molecules" class="species_grid"></div>
      </div>
      <div class="species_group">
        <h4>金属离子</h4>
        <div id="species_cations" class="species_grid"></div>
      </div>
      <div class="species_group">
        <h4>酸根/多原子离子</h4>
        <div id="species_anions" class="species_grid"></div>
      </div>
    </div>

    <div id="balancing_builder">
      <h3>拖拽组装方程式</h3>
      <div id="equation_board">
        <div class="drop_zone" id="left_zone">
          <span class="zone_title">反应物</span>
          <div class="zone_content" id="left_content"></div>
        </div>
        <div class="equation_equals">=</div>
        <div class="drop_zone" id="right_zone">
          <span class="zone_title">生成物</span>
          <div class="zone_content" id="right_content"></div>
        </div>
      </div>

      <div id="equation_preview" aria-live="polite"></div>

      <div id="custom_input">
        <label for="custom_species">不常见离子/分子</label>
        <div class="custom_row">
          <input id="custom_species" type="text" placeholder="例如：SO4 2-、Fe 3+、NH4 +、3 H2O" />
          <select id="custom_side">
            <option value="left">放入反应物</option>
            <option value="right">放入生成物</option>
          </select>
          <button id="add_species_btn" type="button">添加</button>
        </div>
        <p class="custom_hint">电荷、指定的系数与主体用空格隔开，输入后会自动进行上下标美化。</p>
      </div>

      <div class="balancing_actions">
        <button id="balance_btn" type="button">开始配平</button>
        <button id="reset_btn" type="button">清空</button>
      </div>

      <div class="balancing_options">
        <label class="toggle_option">
          <input id="lock_coeffs" type="checkbox" />
          锁定系数
        </label>
        <label class="toggle_option">
          <input id="thermo_toggle" type="checkbox" />
          改为热化学方程式
        </label>
      </div>

      <div id="thermo_selector" class="thermo_selector is-hidden" aria-hidden="true">
        <div class="thermo_header">
          <span>选择标准物质</span>
          <span class="thermo_hint">点击后将系数定为 1</span>
        </div>
        <div id="thermo_list" class="thermo_list"></div>
        <p id="thermo_empty" class="thermo_empty">请先添加方程式里的物质。</p>
      </div>

      <div id="balance_result" aria-live="polite"></div>
      <div id="balance_error" aria-live="assertive"></div>
    </div>
  </div>

  <RouterLink id="back_link" to="/calculation">返回计算首页</RouterLink>

  <div id="suggestion_modal" class="modal_hidden" aria-hidden="true">
    <div class="modal_overlay"></div>
    <div class="modal_content" role="dialog" aria-modal="true" aria-labelledby="suggestion_title">
      <div class="modal_header">
        <h3 id="suggestion_title">可能遗漏的物质</h3>
        <button id="suggestion_close" type="button" aria-label="关闭">×</button>
      </div>
      <p class="modal_hint">点击卡片可加入反应物或生成物。</p>
      <div id="suggestion_cards" class="species_grid"></div>
    </div>
  </div>
</template>
