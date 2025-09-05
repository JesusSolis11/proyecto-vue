<template>
  <form @submit.prevent="onSubmit" class="max-w-lg mx-auto p-6 border rounded-lg shadow-sm bg-white">
    <!-- Nombre -->
    <div class="mb-4">
      <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
      <input
        id="nombre"
        v-model="form.nombre"
        type="text"
        placeholder="Nombre del producto"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.nombre }"
      />
      <p v-if="errors.nombre" class="text-red-600 text-sm mt-1">{{ errors.nombre }}</p>
    </div>

    <!-- SKU -->
    <div class="mb-4">
      <label for="sku" class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
      <input
        id="sku"
        v-model="form.sku"
        type="text"
        placeholder="SKU único"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.sku }"
      />
      <p v-if="errors.sku" class="text-red-600 text-sm mt-1">{{ errors.sku }}</p>
    </div>

    <!-- Precio -->
    <div class="mb-4">
      <label for="precio" class="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
      <input
        id="precio"
        v-model.number="form.precio"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.precio }"
      />
      <p v-if="errors.precio" class="text-red-600 text-sm mt-1">{{ errors.precio }}</p>
    </div>

    <!-- Stock -->
    <div class="mb-4">
      <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
      <input
        id="stock"
        v-model.number="form.stock"
        type="number"
        min="0"
        step="1"
        placeholder="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.stock }"
      />
      <p v-if="errors.stock" class="text-red-600 text-sm mt-1">{{ errors.stock }}</p>
    </div>

    <!-- Categoría -->
    <div class="mb-4">
      <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
      <input
        id="categoria"
        v-model="form.categoria"
        type="text"
        placeholder="Categoría del producto"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.categoria }"
      />
      <p v-if="errors.categoria" class="text-red-600 text-sm mt-1">{{ errors.categoria }}</p>
    </div>

    <!-- Activo -->
    <div class="mb-6 flex items-center">
      <input
        id="activo"
        v-model="form.activo"
        type="checkbox"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="activo" class="ml-2 block text-sm text-gray-900">Producto activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end space-x-3">
      <button 
        type="button" 
        @click="$emit('cancelar')" 
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Guardar
      </button>
    </div>
  </form>
</template>

<script>
import { reactive, watch } from 'vue';

export default {
  name: 'ProductoForm',
  props: {
    producto: {
      type: Object,
      default: () => ({
        nombre: '',
        sku: '',
        precio: null,
        stock: 0,
        categoria: '',
        activo: true,
      }),
    },
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const form = reactive({ ...props.producto });
    const errors = reactive({});

    // Actualizar form si cambia la prop producto (para editar)
    watch(
      () => props.producto,
      (newVal) => {
        Object.assign(form, newVal);
        clearErrors();
      },
      { deep: true, immediate: true }
    );

    function clearErrors() {
      Object.keys(errors).forEach(key => {
        errors[key] = '';
      });
    }

    function validar() {
      clearErrors();
      let valido = true;

      if (!form.nombre || !form.nombre.trim()) {
        errors.nombre = 'El nombre es obligatorio.';
        valido = false;
      }
      
      if (!form.sku || !form.sku.trim()) {
        errors.sku = 'El SKU es obligatorio.';
        valido = false;
      }
      
      if (form.precio === null || form.precio === '' || form.precio <= 0) {
        errors.precio = 'El precio debe ser mayor a 0.';
        valido = false;
      }
      
      if (form.stock === null || form.stock === '' || form.stock < 0) {
        errors.stock = 'El stock debe ser 0 o mayor.';
        valido = false;
      }
      
      if (!form.categoria || !form.categoria.trim()) {
        errors.categoria = 'La categoría es obligatoria.';
        valido = false;
      }

      return valido;
    }

    function onSubmit() {
      if (validar()) {
        // Limpiar espacios en blanco
        const productoLimpio = {
          ...form,
          nombre: form.nombre.trim(),
          sku: form.sku.trim(),
          categoria: form.categoria.trim(),
        };
        emit('guardar', productoLimpio);
      }
    }

    return {
      form,
      errors,
      onSubmit,
    };
  },
};
</script>