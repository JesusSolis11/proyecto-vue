<template>
  <div>
    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border border-gray-300 cursor-pointer" @click="sortBy('nombre')">Nombre</th>
          <th class="p-2 border border-gray-300 cursor-pointer" @click="sortBy('sku')">SKU</th>
          <th class="p-2 border border-gray-300 cursor-pointer" @click="sortBy('precio')">Precio</th>
          <th class="p-2 border border-gray-300 cursor-pointer" @click="sortBy('stock')">Stock</th>
          <th class="p-2 border border-gray-300 cursor-pointer" @click="sortBy('categoria')">Categoría</th>
          <th class="p-2 border border-gray-300">Activo</th>
          <th class="p-2 border border-gray-300">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50">
          <td class="p-2 border border-gray-300">{{ producto.nombre }}</td>
          <td class="p-2 border border-gray-300">{{ producto.sku }}</td>
          <td class="p-2 border border-gray-300">${{ producto.precio.toFixed(2) }}</td>
          <td class="p-2 border border-gray-300">{{ producto.stock }}</td>
          <td class="p-2 border border-gray-300">{{ producto.categoria }}</td>
          <td class="p-2 border border-gray-300">
            <input type="checkbox" :checked="producto.activo" disabled />
          </td>
          <td class="p-2 border border-gray-300 space-x-2">
            <button @click="$emit('ver', producto)" class="text-blue-600 hover:underline">Ver</button>
            <button @click="$emit('editar', producto)" class="text-green-600 hover:underline">Editar</button>
            <button @click="$emit('eliminar', producto)" class="text-red-600 hover:underline">Eliminar</button>
          </td>
        </tr>
        <tr v-if="productos.length === 0">
          <td colspan="7" class="p-4 text-center text-gray-500">No hay productos para mostrar.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductoTable',
  props: {
    productos: {
      type: Array,
      required: true,
    },
  },
  methods: {
    sortBy(campo) {
      this.$emit('sort', campo);
    },
  },
};
</script>