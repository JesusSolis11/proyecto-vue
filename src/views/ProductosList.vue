<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Listado de Productos</h1>
      <p class="text-gray-600">Gestiona tu inventario de productos</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div class="flex-1 max-w-lg">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Buscar por nombre o SKU..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600">
          {{ totalFiltrado }} producto{{ totalFiltrado !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="store.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ store.error }}</p>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white shadow rounded-lg">
      <ProductoTable
        :productos="productosPaginados"
        :current-sort="store.sort"
        @ver="verProducto"
        @editar="editarProducto"
        @eliminar="abrirModalEliminar"
        @sort="onSort"
      />

      <!-- Paginación -->
      <div v-if="totalPaginas > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              :disabled="page === 1"
              @click="cambiarPagina(page - 1)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              :disabled="page === totalPaginas"
              @click="cambiarPagina(page + 1)"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (page - 1) * store.pageSize + 1 }}</span>
                a
                <span class="font-medium">{{ Math.min(page * store.pageSize, totalFiltrado) }}</span>
                de
                <span class="font-medium">{{ totalFiltrado }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  :disabled="page === 1"
                  @click="cambiarPagina(page - 1)"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <template v-for="pageNum in visiblePages" :key="pageNum">
                  <button
                    v-if="pageNum !== '...'"
                    @click="cambiarPagina(pageNum)"
                    :class="[
                      pageNum === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                  >
                    {{ pageNum }}
                  </button>
                  <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                </template>

                <button
                  :disabled="page === totalPaginas"
                  @click="cambiarPagina(page + 1)"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <AppModal
      :visible="modalVisible"
      title="Confirmar eliminación"
      @close="cerrarModal"
      @confirm="eliminarProducto"
    >
      <p class="text-gray-700">
        ¿Estás seguro que deseas eliminar el producto 
        <span class="font-semibold">{{ productoAEliminar?.nombre }}</span>?
      </p>
      <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
    </AppModal>

    <!-- Toast de notificaciones -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto"
      :class="toast.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="toast.show = false"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import ProductoTable from '@/components/ProductoTable.vue';
import AppModal from '@/components/Ui/AppModal.vue';
import { useRouter } from 'vue-router';

export default {
  components: { ProductoTable, AppModal },
  setup() {
    const store = useProductosStore();
    const router = useRouter();

    const search = ref(store.search);
    const page = ref(store.page);

    const productosPaginados = computed(() => store.productosPaginados);
    const totalPaginas = computed(() => store.totalPaginas);
    const totalFiltrado = computed(() => store.totalFiltrado);

    const modalVisible = ref(false);
    const productoAEliminar = ref(null);

    // Toast notifications
    const toast = ref({
      show: false,
      message: '',
      type: 'success' // 'success' | 'error'
    });

    // Visible pages for pagination
    const visiblePages = computed(() => {
      const current = page.value;
      const total = totalPaginas.value;
      const pages = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        } else if (current >= total - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        }
      }

      return pages;
    });

    function showToast(message, type = 'success') {
      toast.value = {
        show: true,
        message,
        type
      };
      setTimeout(() => {
        toast.value.show = false;
      }, 5000);
    }

    // Watchers
    watch(
      () => store.page,
      (newPage) => {
        page.value = newPage;
      }
    );

    watch(
      () => store.search,
      (newSearch) => {
        search.value = newSearch;
      }
    );

    function onSearch() {
      store.setSearch(search.value);
    }

    function cambiarPagina(nuevaPagina) {
      store.setPage(nuevaPagina);
    }

    function verProducto(producto) {
      router.push(`/productos/${producto.id}`);
    }

    function editarProducto(producto) {
      router.push(`/productos/${producto.id}/editar`);
    }

    function abrirModalEliminar(producto) {
      productoAEliminar.value = producto;
      modalVisible.value = true;
    }

    function cerrarModal() {
      modalVisible.value = false;
      productoAEliminar.value = null;
    }

    async function eliminarProducto() {
      if (!productoAEliminar.value) return;
      
      try {
        await store.eliminarProducto(productoAEliminar.value.id);
        showToast('Producto eliminado con éxito', 'success');
      } catch (error) {
        showToast('Error al eliminar producto: ' + error.message, 'error');
      } finally {
        cerrarModal();
      }
    }

    function onSort(campo) {
      let direccion = 'asc';
      if (store.sort.startsWith(campo)) {
        direccion = store.sort.endsWith('asc') ? 'desc' : 'asc';
      }
      store.setSort(`${campo}_${direccion}`);
    }

    onMounted(() => {
      store.fetchProductos();
    });

    return {
      store,
      search,
      page,
      totalPaginas,
      totalFiltrado,
      productosPaginados,
      visiblePages,
      toast,
      onSearch,
      cambiarPagina,
      verProducto,
      editarProducto,
      abrirModalEliminar,
      cerrarModal,
      eliminarProducto,
      modalVisible,
      productoAEliminar,
      onSort,
    };
  },
};
</script>