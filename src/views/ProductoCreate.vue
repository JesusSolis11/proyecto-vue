<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Crear Producto</h1>
    <ProductoForm @guardar="crearProducto" @cancelar="cancelar" />
  </div>
</template>

<script>
import ProductoForm from '@/components/productos/ProductoForm.vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useRouter } from 'vue-router';

export default {
  components: { ProductoForm },
  setup() {
    const store = useProductosStore();
    const router = useRouter();

    async function crearProducto(producto) {
      try {
        await store.crearProducto(producto);
        alert('Producto creado con éxito');
        router.push('/productos');
      } catch (error) {
        alert('Error al crear producto: ' + error.message);
      }
    }

    function cancelar() {
      router.push('/productos');
    }

    return { crearProducto, cancelar };
  },
};
</script>