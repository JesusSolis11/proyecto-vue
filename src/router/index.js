import { createRouter, createWebHistory } from 'vue-router';

// Importar las vistas
import ProductosList from '@/views/ProductosList.vue';
import ProductoCreate from '@/views/ProductoCreate.vue';
import ProductoEdit from '@/views/ProductoEdit.vue';
import ProductoDetail from '@/views/ProductoDetail.vue';

const routes = [
  {
    path: '/',
    redirect: '/productos'
  },
  {
    path: '/productos',
    name: 'ProductosList',
    component: ProductosList,
    meta: { title: 'Listado de Productos' }
  },
  {
    path: '/productos/crear',
    name: 'ProductoCreate',
    component: ProductoCreate,
    meta: { title: 'Crear Producto' }
  },
  {
    path: '/productos/:id/editar',
    name: 'ProductoEdit',
    component: ProductoEdit,
    meta: { title: 'Editar Producto' },
    props: route => ({ id: Number(route.params.id) })
  },
  {
    path: '/productos/:id',
    name: 'ProductoDetail',
    component: ProductoDetail,
    meta: { title: 'Detalle del Producto' },
    props: route => ({ id: Number(route.params.id) })
  },
  // Ruta para manejar rutas no encontradas
  {
    path: '/:pathMatch(.*)*',
    redirect: '/productos'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para actualizar el título de la página
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title + ' - Gestión de Productos';
  } else {
    document.title = 'Gestión de Productos';
  }
  next();
});

export default router;