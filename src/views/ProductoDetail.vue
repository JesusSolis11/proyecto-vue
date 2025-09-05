<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Detalle del Producto</h1>

    <div v-if="loading" class="text-center">Cargando...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="producto" class="bg-white shadow rounded p-6">
      <p><strong>ID:</strong> {{ producto.id }}</p>
      <p><strong>Nombre:</strong> {{ producto.nombre }}</p>
      <p><strong>SKU:</strong> {{ producto.sku }}</p>
      <p><strong>Precio:</strong> ${{ producto.precio.toFixed(2) }}</p>
      <p><strong>Stock:</strong> {{ producto.stock }}</p>
      <p><strong>Categoría:</strong> {{ producto.categoria }}</p>
      <p><strong>Activo:</strong> {{ producto.activo ? 'Sí' : 'No' }}</p>
      <p><strong>Creado en:</strong> {{ producto.creadoEn }}</p>

      <div class="mt-6 flex space-x-4">
        <button @click="editar" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Editar
        </button>
        <button @click="confirmarEliminar" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Eliminar
        </button>
        <button @click="volver" class="px-4 py-2 border rounded hover:bg-gray-100">
          Volver
        </button>
      </div>
    </div>
    <div v-else>
      <p>Producto no encontrado.</p>
    </div>

    <!-- Modal de confirmación -->
    <AppModal
      :visible="modalVisible"
      title="Confirmar eliminación"
      @close="cerrarModal"
      @confirm="eliminarProducto"
    >
      <p>¿Estás seguro que deseas eliminar el producto <strong>{{ producto?.nombre }}</strong>?</p>
    </AppModal>
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

    async function cargarProducto() {
      loading.value = true;
      error.value = null;
      try {
        // Intentamos obtener producto del store
        const id = Number(route.params.id);
        // Si el store no tiene productos cargados, los cargamos
        if (store.productos.length === 0) {
          await store.fetchProductos();
        }
        producto.value = store.productos.find(p => p.id === id) || null;
        if (!producto.value) {
          error.value = 'Producto no encontrado';
        }
      } catch (err) {
        error.value = err.message || 'Error al cargar producto';
      } finally {
        loading.value = false;
      }
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
        alert('Producto eliminado con éxito');
        modalVisible.value = false;
        router.push('/productos');
      } catch (err) {
        alert('Error al eliminar producto: ' + err.message);
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
      editar,
      volver,
      confirmarEliminar,
      eliminarProducto,
      cerrarModal,
    };
  },
};
</script>

<style scoped>
/* Puedes agregar estilos aquí si quieres */
</style>