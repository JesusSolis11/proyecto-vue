<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Producto</h1>
      <p class="text-gray-600">Actualiza la información del producto</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

    <!-- Form -->
    <div v-else-if="producto">
      <ProductoForm 
        :producto="producto" 
        @guardar="editarProducto" 
        @cancelar="cancelar" 
      />
    </div>

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
import ProductoForm from '@/components/ProductoForm.vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useRouter, useRoute } from 'vue-router';

export default {
  components: { ProductoForm },
  setup() {
    const store = useProductosStore();
    const router = useRouter();
    const route = useRoute();

    const producto = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Toast notifications
    const toast = ref({
      show: false,
      message: '',
      type: 'success' // 'success' | 'error'
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
      const id = Number(route.params.id);
      loading.value = true;
      error.value = null;
      
      try {
        // Intentar obtener el producto del store primero
        if (store.productos.length === 0) {
          await store.fetchProductos();
        }
        
        let productoEncontrado = store.productos.find(p => p.id === id);
        
        // Si no se encuentra en el store, intentar obtenerlo directamente
        if (!productoEncontrado) {
          try {
            productoEncontrado = await store.obtenerProducto(id);
          } catch (err) {
            console.error('Error fetching individual product:', err);
          }
        }
        
        if (productoEncontrado) {
          producto.value = { ...productoEncontrado };
        } else {
          error.value = 'Producto no encontrado';
        }
      } catch (err) {
        console.error('Error loading product:', err);
        error.value = err.message || 'Error al cargar producto';
      } finally {
        loading.value = false;
      }
    }

    async function editarProducto(productoEditado) {
      try {
        await store.actualizarProducto(route.params.id, productoEditado);
        showToast('Producto actualizado con éxito', 'success');
        
        // Esperar un momento para mostrar el toast antes de navegar
        setTimeout(() => {
          router.push('/productos');
        }, 1000);
      } catch (error) {
        console.error('Error updating producto:', error);
        
        // Manejar errores específicos
        let errorMessage = 'Error al actualizar producto';
        
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || 'Datos inválidos';
        } else if (error.response?.status === 404) {
          errorMessage = 'Producto no encontrado';
        } else if (error.response?.status === 409) {
          errorMessage = 'El SKU ya existe en otro producto';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Error del servidor, intenta más tarde';
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
        
        showToast(errorMessage, 'error');
      }
    }

    function cancelar() {
      router.push('/productos');
    }

    onMounted(() => {
      cargarProducto();
    });

    return { 
      producto,
      loading,
      error,
      toast,
      editarProducto, 
      cancelar 
    };
  },
};
</script>