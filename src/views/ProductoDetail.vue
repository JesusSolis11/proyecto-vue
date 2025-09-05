<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Detalle del Producto</h1>
      <p class="text-gray-600">Información completa del producto</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Product detail -->
    <div v-else-if="producto" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ producto.nombre }}</h2>
            <p class="text-sm text-gray-500">SKU: {{ producto.sku }}</p>
          </div>
          <div class="flex items-center">
            <span 
              :class="producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
            >
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="px-6 py-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">ID</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ producto.id }}</dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500">Precio</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              ${{ formatPrice(producto.precio) }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500">Stock</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span :class="getStockColor(producto.stock)" class="font-medium">
                {{ producto.stock }} unidades
              </span>
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500">Categoría</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {{ producto.categoria }}
              </span>
            </dd>
          </div>

          <div class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Fecha de creación</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(producto.creadoEn) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            @click="volver" 
            class="inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al listado
          </button>

          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              @click="editar" 
              class="inline-flex justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar producto
            </button>

            <button 
              @click="confirmarEliminar" 
              class="inline-flex justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar producto
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Producto no encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">El producto que buscas no existe o fue eliminado.</p>
      <div class="mt-6">
        <button @click="volver" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
          Volver al listado
        </button>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <AppModal
      :visible="modalVisible"
      title="Confirmar eliminación"
      @close="cerrarModal"
      @confirm="eliminarProducto"
    >
      <div class="text-center">
        <svg class="mx-auto mb-4 w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="mb-3 text-lg text-gray-700">
          ¿Estás seguro que deseas eliminar el producto?
        </p>
        <p class="text-sm text-gray-500 mb-4">
          <strong>{{ producto?.nombre }}</strong><br>
          Esta acción no se puede deshacer.
        </p>
      </div>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductosStore } from '@/stores/useProductosStore';
import AppModal from '@/components/Ui/AppModal.vue';

export default {
  components: { AppModal },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductosStore();

    const producto = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const modalVisible = ref(false);

    // Toast notifications
    const toast = ref({
      show: false,
      message: '',
      type: 'success'
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

    async function cargarProducto() {
      loading.value = true;
      error.value = null;
      try {
        const id = Number(route.params.id);
        
        // Intentar obtener producto del store
        if (store.productos.length === 0) {
          await store.fetchProductos();
        }
        
        let productoEncontrado = store.productos.find(p => p.id === id);
        
        // Si no está en el store, obtenerlo directamente de la API
        if (!productoEncontrado) {
          try {
            productoEncontrado = await store.obtenerProducto(id);
          } catch (err) {
            console.error('Producto no encontrado:', err);
          }
        }
        
        if (productoEncontrado) {
          producto.value = productoEncontrado;
        } else {
          error.value = 'Producto no encontrado';
        }
      } catch (err) {
        error.value = err.message || 'Error al cargar producto';
      } finally {
        loading.value = false;
      }
    }

    function formatPrice(price) {
      return typeof price === 'number' ? price.toFixed(2) : '0.00';
    }

    function formatDate(dateString) {
      if (!dateString) return 'No disponible';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (err) {
        return 'Fecha inválida';
      }
    }

    function getStockColor(stock) {
      if (stock === 0) return 'text-red-600';
      if (stock <= 10) return 'text-yellow-600';
      return 'text-green-600';
    }

    function editar() {
      router.push(`/productos/${producto.value.id}/editar`);
    }

    function volver() {
      router.push('/productos');
    }

    function confirmarEliminar() {
      modalVisible.value = true;
    }

    async function eliminarProducto() {
      if (!producto.value) return;
      try {
        await store.eliminarProducto(producto.value.id);
        showToast('Producto eliminado con éxito', 'success');
        modalVisible.value = false;
        
        // Navegar después de mostrar el toast
        setTimeout(() => {
          router.push('/productos');
        }, 1000);
      } catch (err) {
        showToast('Error al eliminar producto: ' + err.message, 'error');
      }
    }

    function cerrarModal() {
      modalVisible.value = false;
    }

    onMounted(() => {
      cargarProducto();
    });

    return {
      producto,
      loading,
      error,
      modalVisible,
      toast,
      formatPrice,
      formatDate,
      getStockColor,
      editar,
      volver,
      confirmarEliminar,
      eliminarProducto,
      cerrarModal,
    };
  },
};
</script>