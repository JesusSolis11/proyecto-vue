<template>
  <form @submit.prevent="onSubmit" class="max-w-lg mx-auto p-4 border rounded shadow-sm bg-white">
    <div class="mb-4">
      <label for="nombre" class="block font-semibold mb-1">Nombre *</label>
      <input
        id="nombre"
        v-model="form.nombre"
        type="text"
        placeholder="Nombre del producto"
        class="w-full border p-2 rounded"
      />
      <p v-if="errors.nombre" class="text-red-600 text-sm mt-1">{{ errors.nombre }}</p>
    </div>

    <div class="mb-4">
      <label for="sku" class="block font-semibold mb-1">SKU *</label>
      <input
        id="sku"
        v-model="form.sku"
        type="text"
        placeholder="SKU único"
        class="w-full border p-2 rounded"
      />
      <p v-if="errors.sku" class="text-red-600 text-sm mt-1">{{ errors.sku }}</p>
    </div>

    <div class="mb-4">
      <label for="precio" class="block font-semibold mb-1">Precio *</label>
      <input
        id="precio"
        v-model.number="form.precio"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Precio mayor a 0"
        class="w-full border p-2 rounded"
      />
      <p v-if="errors.precio" class="text-red-600 text-sm mt-1">{{ errors.precio }}</p>
    </div>

    <div class="mb-4">
      <label for="stock" class="block font-semibold mb-1">Stock *</label>
      <input
        id="stock"
        v-model.number="form.stock"
        type="number"
        min="0"
        step="1"
        placeholder="Stock (0 o más)"
        class="w-full border p-2 rounded"
      />
      <p v-if="errors.stock" class="text-red-600 text-sm mt-1">{{ errors.stock }}</p>
    </div>

    <div class="mb-4">
      <label for="categoria" class="block font-semibold mb-1">Categoría *</label>
      <input
        id="categoria"
        v-model="form.categoria"
        type="text"
        placeholder="Categoría"
        class="w-full border p-2 rounded"
      />
      <p v-if="errors.categoria" class="text-red-600 text-sm mt-1">{{ errors.categoria }}</p>
    </div>

    <div class="mb-4 flex items-center">
      <input
        id="activo"
        v-model="form.activo"
        type="checkbox"
        class="mr-2"
      />
      <label for="activo" class="font-semibold">Activo</label>
    </div>

    <div class="flex justify-end space-x-2">
      <button type="button" @click="$emit('cancelar')" class="px-4 py-2 border rounded hover:bg-gray-100">
        Cancelar
      </button>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Guardar
      </button>
    </div>
  </form>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';

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
      }
    );

    function clearErrors() {
      for (const key in errors) {
        errors[key] = '';
      }
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
        emit('guardar', { ...form });
      }
    }

    return {
      ...toRefs(form),
      errors,
      onSubmit,
    };
  },
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales si quieres */
</style>