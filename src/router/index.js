import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KnowledgeView from '../views/KnowledgeView.vue'
import KnowledgeDetailView from '../views/KnowledgeDetailView.vue'
import ElementsView from '../views/ElementsView.vue'
import ElementsDetailView from '../views/ElementsDetailView.vue'
import Readme3DView from '../views/Readme3DView.vue'
import CalculationView from '../views/CalculationView.vue'
import BalancingView from '../views/BalancingView.vue'
import ExtensionView from '../views/ExtensionView.vue'
import ExtensionDetailView from '../views/ExtensionDetailView.vue'
import ChemDoodleView from '../views/ChemDoodleView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/knowledge', name: 'knowledge', component: KnowledgeView },
    { path: '/knowledge/knowledge.html', redirect: '/knowledge' },
    { path: '/knowledge/compulsory-1.html', redirect: '/knowledge/compulsory-1' },
    { path: '/knowledge/compulsory-2.html', redirect: '/knowledge/compulsory-2' },
    { path: '/knowledge/elective-1.html', redirect: '/knowledge/elective-1' },
    { path: '/knowledge/elective-2.html', redirect: '/knowledge/elective-2' },
    { path: '/knowledge/elective-3.html', redirect: '/knowledge/elective-3' },
    { path: '/knowledge/:slug', name: 'knowledge-detail', component: KnowledgeDetailView },
    { path: '/elements', name: 'elements', component: ElementsView },
    { path: '/elements/detail', name: 'elements-detail', component: ElementsDetailView },
    { path: '/docs/3d-readme', name: 'readme-3d', component: Readme3DView },
    {
      path: '/elements/detail.html',
      redirect: (to) => ({ path: '/elements/detail', query: to.query })
    },
    { path: '/calculation', name: 'calculation', component: CalculationView },
    { path: '/calculation/balancing', name: 'balancing', component: BalancingView },
    { path: '/calculation/calculation.html', redirect: '/calculation' },
    { path: '/calculation/balancing.html', redirect: '/calculation/balancing' },
    { path: '/extension', name: 'extension', component: ExtensionView },
    { path: '/extension/extension.html', redirect: '/extension' },
    { path: '/extension/extension-reading.html', redirect: '/extension/reading' },
    {
      path: '/extension/extension-knowledge/structural-chemistry/structural-chemistry.html',
      redirect: '/extension/structural-chemistry'
    },
    {
      path: '/extension/extension-knowledge/redox-electrochemistry/redox-electrochemistry.html',
      redirect: '/extension/redox-electrochemistry'
    },
    {
      path: '/extension/extension-knowledge/organic-chemistry/organic-chemistry.html',
      redirect: '/extension/organic-chemistry'
    },
    {
      path: '/extension/extension-knowledge/lab-industry/instruments-standards.html',
      redirect: '/extension/lab-industry/instruments-standards'
    },
    {
      path: '/extension/extension-knowledge/lab-industry/basic-operations.html',
      redirect: '/extension/lab-industry/basic-operations'
    },
    {
      path: '/extension/extension-knowledge/lab-industry/ions-gases-tests.html',
      redirect: '/extension/lab-industry/ions-gases-tests'
    },
    {
      path: '/extension/extension-knowledge/lab-industry/gas-prep-purify-collect.html',
      redirect: '/extension/lab-industry/gas-prep-purify-collect'
    },
    {
      path: '/extension/:pathMatch(.*)*',
      name: 'extension-detail',
      component: ExtensionDetailView
    },
    { path: '/chemdoodle', name: 'chemdoodle', component: ChemDoodleView },
    { path: '/elements/elements.html', redirect: '/elements' },
    { path: '/index.html', redirect: '/' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

export default router
