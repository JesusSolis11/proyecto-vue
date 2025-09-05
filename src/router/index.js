import { createRouter, createWebHistory } from 'vue-router'
import ProductosList from '@/views/ProductosList.vue'

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/productos', name: 'ProductosList', component: ProductosList, meta: { title: 'Productos' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta?.title ? to.meta.title + ' - ' : '') + 'Gestión de Productos'
  next()
})

export default router
