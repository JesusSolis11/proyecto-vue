<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Editar Producto</h1>
    <ProductoForm :producto="producto" @guardar="editarProducto" @cancelar="cancelar" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProductoForm from '@/components/productos/ProductoForm.vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useRouter, useRoute } from 'vue-router';

export default {
  components: { ProductoForm },
  setup() {
    const store = useProductosStore();
    const router = useRouter();
    const route = useRoute();

    const producto = ref(null);

    onMounted(async () => {
      try {
        producto.value = await store.obtenerProducto(route.params.id);
      } catch (error) {
        alert('Error al cargar producto');
        router.push('/productos');
      }
    });

    async function editarProducto(productoEditado) {
      try {
        await store.actualizarProducto(route.params.id, productoEditado);
        alert('Producto actualizado con éxito');
        router.push('/productos');
      } catch (error) {
        alert('Error al actualizar producto: ' + error.message);
      }
    }

    function cancelar() {
      router.push('/productos');
    }

    return { producto, editarProducto, cancelar };
  },
};
</script>