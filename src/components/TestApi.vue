<template>
  <div>
    <h2>Prueba API Productos</h2>
    <ul>
      <li v-for="producto in productos" :key="producto.id">
        {{ producto.nombre }} - ${{ producto.precio }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProductos } from '@/api/productos.service';

const productos = ref([]);

onMounted(async () => {
  try {
    const response = await getProductos();
    productos.value = response.data;
    console.log('Productos:', productos.value);
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
});
</script>