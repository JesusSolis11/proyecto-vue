<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Listado de Productos</h1>

    <input
      v-model="search"
      @input="onSearch"
      type="text"
      placeholder="Buscar por nombre o SKU"
      class="border p-2 mb-4 rounded w-full max-w-md"
    />

    <ProductoTable
      :productos="productosPaginados"
      @ver="verProducto"
      @editar="editarProducto"
      @eliminar="abrirModalEliminar"
      @sort="onSort"
    />

    <div class="mt-4 flex items-center space-x-4">
      <button
        :disabled="page === 1"
        @click="cambiarPagina(page - 1)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span>Página {{ page }} de {{ totalPaginas }}</span>

      <button
        :disabled="page === totalPaginas"
        @click="cambiarPagina(page + 1)"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal de confirmación -->
    <AppModal
      :visible="modalVisible"
      title="Confirmar eliminación"
      @close="cerrarModal"
      @confirm="eliminarProducto"
    >
      <p>¿Estás seguro que deseas eliminar el producto <strong>{{ productoAEliminar?.nombre }}</strong>?</p>
    </AppModal>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import ProductoTable from '@/components/productos/ProductoTable.vue';
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

    const modalVisible = ref(false);
    const productoAEliminar = ref(null);

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
        alert('Producto eliminado con éxito');
      } catch (error) {
        alert('Error al eliminar producto: ' + error.message);
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
      search,
      page,
      totalPaginas,
      productosPaginados,
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