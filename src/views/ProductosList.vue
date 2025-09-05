<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Productos</h1>
        <p class="text-sm text-zinc-500">Inventario.</p>
      </div>
      <div class="flex gap-2">
        <button @click="abrirNuevo" class="h-10 px-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700">Nuevo</button>
      </div>
    </div>
    <!-- Barra de búsqueda -->
    <div class="relative">
      <input
        v-model="q"
        type="search"
        placeholder="Buscar por Nombre o SKU"
        class="h-10 w-full sm:w-[24rem] rounded-xl border border-zinc-300 pl-10 pr-9 focus:outline-none focus:ring-4 focus:ring-primary-200"
      />
      <!-- limpiar -->
      <button
        v-if="q"
        @click="q=''"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
        aria-label="Limpiar"
        title="Limpiar"
      >✕</button>
    </div>

    <!-- Tabla -->
    <div v-if="store.loading" class="text-sm text-zinc-500">Cargando…</div>
    <div v-else-if="store.error" class="text-sm text-rose-600">{{ store.error }}</div>

    <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table class="w-full text-sm border-collapse">
        <thead class="bg-zinc-50 text-zinc-600">
          <tr>
            <th class="text-left font-medium px-4 py-3">ID</th>
            <th class="text-left font-medium px-4 py-3">Nombre</th>
            <th class="text-left font-medium px-4 py-3">SKU</th>
            <th class="text-left font-medium px-4 py-3">Precio</th>
            <th class="text-left font-medium px-4 py-3">Stock</th>
            <th class="text-left font-medium px-4 py-3">Categoría</th>
            <th class="text-left font-medium px-4 py-3">Activo</th>
            <th class="text-right font-medium px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id" class="border-t border-zinc-200">
            <td class="px-4 py-3">{{ p.id }}</td>
            <td class="px-4 py-3 font-medium">{{ p.nombre }}</td>
            <td class="px-4 py-3">{{ p.sku }}</td>
            <td class="px-4 py-3">$ {{ Number(p.precio).toFixed(2) }}</td>
            <td class="px-4 py-3">{{ p.stock }}</td>
            <td class="px-4 py-3">{{ p.categoria }}</td>
            <td class="px-4 py-3">
              <span :class="p.activo ? 'text-emerald-600' : 'text-rose-600'">{{ p.activo ? 'Sí' : 'No' }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="editar(p)" class="px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100">Editar</button>
              <button @click="eliminar(p.id)" class="ml-2 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!store.loading && filtered.length === 0">
            <td colspan="8" class="px-4 py-10 text-center text-zinc-500">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <dialog v-if="show" open class="backdrop:bg-black/40 rounded-2xl p-0 w-[min(42rem,92vw)]">
      <div class="p-5 border-b border-zinc-200">
        <h3 class="text-lg font-semibold">{{ editing ? 'Editar producto' : 'Nuevo producto' }}</h3>
      </div>
      <form class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="guardar">
        <input v-model="form.nombre" placeholder="Nombre" class="h-10 rounded-xl border border-zinc-300 px-3" />
        <input v-model="form.sku" placeholder="SKU" class="h-10 rounded-xl border border-zinc-300 px-3" />
        <input v-model.number="form.precio" type="number" step="0.01" placeholder="Precio" class="h-10 rounded-xl border border-zinc-300 px-3" />
        <input v-model.number="form.stock" type="number" placeholder="Stock" class="h-10 rounded-xl border border-zinc-300 px-3" />
        <input v-model="form.categoria" placeholder="Categoría" class="h-10 rounded-xl border border-zinc-300 px-3" />
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.activo" />
          <span>Activo</span>
        </label>
      </form>
      <div class="p-5 flex justify-end gap-2 border-t border-zinc-200">
        <button @click="cerrar" class="h-10 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100">Cancelar</button>
        <button @click="guardar" class="h-10 px-4 rounded-xl bg-primary-600 text-white hover:bg-primary-700">Guardar</button>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useProductosStore } from "@/stores/useProductosStore";

const store = useProductosStore();

const show = ref(false);
const editing = ref(false);
const currentId = ref(null);
const form = ref({ nombre:"", sku:"", precio:0, stock:0, categoria:"", activo:true });

const q = ref(""); 
// término de búsqueda

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return store.productos;
  return store.productos.filter(p => {
    const nombre = String(p.nombre ?? "").toLowerCase();
    const sku = String(p.sku ?? "").toLowerCase();
    return nombre.includes(term) || sku.includes(term);
  });
});

onMounted(() => {
  store.fetchProductos();
});

function reload(){ store.fetchProductos(); }

function abrirNuevo(){
  editing.value = false;
  currentId.value = null;
  form.value = { nombre:"", sku:"", precio:0, stock:0, categoria:"", activo:true };
  show.value = true;
}
function editar(p){
  editing.value = true;
  currentId.value = p.id;
  form.value = { nombre:p.nombre ?? "", sku:p.sku ?? "", precio:Number(p.precio)||0, stock:Number(p.stock)||0, categoria:p.categoria ?? "", activo: !!p.activo };
  show.value = true;
}
function cerrar(){ show.value = false; }

async function guardar(){
  if(!form.value.nombre) return;
  if(editing.value && currentId.value){
    await store.editProducto(currentId.value, form.value);
  } else {
    await store.addProducto(form.value);
  }
  show.value = false;
}

async function eliminar(id){
  if(!confirm("¿Eliminar producto?")) return;
  await store.removeProducto(id);
}
</script>
