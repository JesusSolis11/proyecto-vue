<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @keydown.esc="emitClose"
      tabindex="-1"
    >
      <div class="absolute inset-0 bg-black/50" @click="emitClose"></div>

      <div class="relative w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
        <header class="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button
            @click="emitClose"
            aria-label="Cerrar"
            class="grid h-8 w-8 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100"
          >×</button>
        </header>

        <section class="p-5">
          <slot />
        </section>

        <footer class="flex justify-end gap-2 px-5 py-4 border-t border-zinc-200">
          <button
            @click="emitClose"
            class="h-10 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100"
          >Cancelar</button>
          <button
            @click="$emit('confirm')"
            class="h-10 px-4 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >Confirmar</button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: 'Confirmar acción' },
})
const emit = defineEmits(['close', 'confirm'])

function emitClose() {
  emit('close')
}
function onKey(e) {
  if (e.key === 'Escape' && props.visible) emitClose()
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

watch(() => props.visible, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
