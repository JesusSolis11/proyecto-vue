<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Producto</h1>
      <p class="text-gray-600">Agrega un producto a tu inventario</p>
    </div>

    <!-- Loading state -->
    <div v-if="store.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Form -->
    <div v-else>
      <ProductoForm 
        @guardar="crearProducto" 
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
import { ref } from 'vue';
import ProductoForm from '@/components/ProductoForm.vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useRouter } from 'vue-router';

export default {
  components: { ProductoForm },
  setup() {
    const store = useProductosStore();
    const router = useRouter();

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

    async function crearProducto(producto) {
      try {
        await store.crearProducto(producto);
        showToast('Producto creado con éxito', 'success');
        
        // Esperar un momento para mostrar el toast antes de navegar
        setTimeout(() => {
          router.push('/productos');
        }, 1000);
      } catch (error) {
        console.error('Error creating producto:', error);
        
        // Manejar errores específicos
        let errorMessage = 'Error al crear producto';
        
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || 'Datos inválidos';
        } else if (error.response?.status === 409) {
          errorMessage = 'El SKU ya existe';
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

    return { 
      store,
      toast,
      crearProducto, 
      cancelar 
    };
  },
};
</script>