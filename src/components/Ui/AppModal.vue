<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded shadow-lg max-w-md w-full p-6">
      <header class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="close" aria-label="Cerrar" class="text-gray-600 hover:text-gray-900">&times;</button>
      </header>
      <section>
        <slot />
      </section>
      <footer class="mt-6 flex justify-end space-x-2">
        <button @click="close" class="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
        <button @click="confirm" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirmar',
    },
  },
  emits: ['close', 'confirm'],
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>