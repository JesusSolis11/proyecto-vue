import { createRouter, createWebHistory } from 'vue-router';

import ProductosList from '@/views/ProductosList.vue';
import ProductoCreate from '@/views/ProductoCreate.vue';
import ProductoEdit from '@/views/ProductoEdit.vue';
import ProductoDetail from '@/views/ProductoDetail.vue';

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/productos', name: 'ProductosList', component: ProductosList },
  { path: '/productos/crear', name: 'ProductoCreate', component: ProductoCreate },
  { path: '/productos/:id/editar', name: 'ProductoEdit', component: ProductoEdit },
  { path: '/productos/:id', name: 'ProductoDetail', component: ProductoDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;