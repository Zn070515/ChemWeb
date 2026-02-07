<template>
  <nav class="site-nav">
    <RouterLink class="nav-brand" to="/">ChemWeb</RouterLink>
    <div class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/knowledge">知识速览</RouterLink>
      <RouterLink to="/elements">元素速查</RouterLink>
      <RouterLink to="/calculation">式量计算与配平</RouterLink>
      <RouterLink to="/extension">拓展知识</RouterLink>
      <RouterLink to="/chemdoodle">结构式编辑</RouterLink>
    </div>
  </nav>
  <main>
    <RouterView />
  </main>
  <footer class="site-footer">
    <div>&copy; 2026 ChemWeb · 302025510036@zjut.edu.cn</div>
    <div>
      <a href="https://github.com/Zn070515/ChemWeb" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </footer>
</template>
