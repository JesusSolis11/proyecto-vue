<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
      <thead class="bg-gray-50">
        <tr>
          <th 
            class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
            @click="sortBy('nombre')"
          >
            <div class="flex items-center space-x-1">
              <span>Nombre</span>
              <svg v-if="sortField === 'nombre'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="sortDirection === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          </th>
          <th 
            class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
            @click="sortBy('sku')"
          >
            <div class="flex items-center space-x-1">
              <span>SKU</span>
              <svg v-if="sortField === 'sku'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="sortDirection === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          </th>
          <th 
            class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
            @click="sortBy('precio')"
          >
            <div class="flex items-center space-x-1">
              <span>Precio</span>
              <svg v-if="sortField === 'precio'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="sortDirection === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          </th>
          <th 
            class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
            @click="sortBy('stock')"
          >
            <div class="flex items-center space-x-1">
              <span>Stock</span>
              <svg v-if="sortField === 'stock'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="sortDirection === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          </th>
          <th 
            class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
            @click="sortBy('categoria')"
          >
            <div class="flex items-center space-x-1">
              <span>Categoría</span>
              <svg v-if="sortField === 'categoria'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="sortDirection === 'asc'" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                <path v-else d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          </th>
          <th class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th class="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ producto.nombre }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">{{ producto.sku }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${{ formatPrice(producto.precio) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <span :class="producto.stock <= 10 ? 'text-red-600' : 'text-gray-900'">
                {{ producto.stock }}
              </span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">{{ producto.categoria }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span 
              :class="producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="inline-flex px-2 text-xs font-semibold rounded-full"
            >
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button 
              @click="$emit('ver', producto)" 
              class="text-blue-600 hover:text-blue-900 transition-colors"
              title="Ver detalles"
            >
              Ver
            </button>
            <button 
              @click="$emit('editar', producto)" 
              class="text-green-600 hover:text-green-900 transition-colors"
              title="Editar producto"
            >
              Editar
            </button>
            <button 
              @click="$emit('eliminar', producto)" 
              class="text-red-600 hover:text-red-900 transition-colors"
              title="Eliminar producto"
            >
              Eliminar
            </button>
          </td>
        </tr>
        
        <!-- Empty state -->
        <tr v-if="productos.length === 0">
          <td colspan="7" class="px-6 py-8 text-center">
            <div class="text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-13 0h3m-3 0v5m0-5h.01M17 8v1a2 2 0 01-2 2h-1m0-3v4a2 2 0 01-2 2h-1m0-3v4a2 2 0 01-2 2h-1"/>
              </svg>
              <p class="mt-2 text-sm">No hay productos para mostrar.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProductoTable',
  props: {
    productos: {
      type: Array,
      required: true,
    },
    currentSort: {
      type: String,
      default: '',
    },
  },
  emits: ['ver', 'editar', 'eliminar', 'sort'],
  setup(props, { emit }) {
    const sortField = computed(() => {
      if (!props.currentSort) return '';
      return props.currentSort.split('_')[0];
    });

    const sortDirection = computed(() => {
      if (!props.currentSort) return 'asc';
      return props.currentSort.split('_')[1] || 'asc';
    });

    function sortBy(campo) {
      emit('sort', campo);
    }

    function formatPrice(price) {
      return typeof price === 'number' ? price.toFixed(2) : '0.00';
    }

    return {
      sortField,
      sortDirection,
      sortBy,
      formatPrice,
    };
  },
};
</script>