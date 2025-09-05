import { defineStore } from 'pinia';
import * as productosService from '@/api/productos.service';

export const useProductosStore = defineStore('productos', {
  state: () => ({
    productos: [],
    productoSeleccionado: null,
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    search: '',
    sort: '', // ejemplo: 'nombre_asc' o 'precio_desc'
  }),
  getters: {
    productosFiltrados(state) {
      let filtered = state.productos;

      // Filtrar por search (nombre o sku)
      if (state.search) {
        const s = state.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.nombre.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
        );
      }

      // Ordenar
      if (state.sort) {
        const [campo, direccion] = state.sort.split('_');
        filtered = filtered.slice().sort((a, b) => {
          if (a[campo] < b[campo]) return direccion === 'asc' ? -1 : 1;
          if (a[campo] > b[campo]) return direccion === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    },
    productosPaginados(state) {
      const start = (state.page - 1) * state.pageSize;
      return this.productosFiltrados.slice(start, start + state.pageSize);
    },
    totalFiltrado(state) {
      return this.productosFiltrados.length;
    },
    totalPaginas(state) {
      return Math.ceil(this.totalFiltrado / state.pageSize);
    },
  },
  actions: {
    async fetchProductos() {
      this.loading = true;
      this.error = null;
      try {
        // No enviamos params porque backend no los usa
        const response = await productosService.getProductos();
        this.productos = response.data; // array simple
      } catch (err) {
        this.error = err.message || 'Error al cargar productos';
      } finally {
        this.loading = false;
      }
    },
    setPage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPaginas) page = this.totalPaginas;
      this.page = page;
    },
    setSearch(search) {
      this.search = search;
      this.page = 1;
    },
    setSort(sort) {
      this.sort = sort;
    },
    setProductoSeleccionado(producto) {
      this.productoSeleccionado = producto;
    },
    // Método para eliminar producto
    async eliminarProducto(id) {
      this.loading = true;
      this.error = null;
      try {
        await productosService.eliminarProducto(id);
        // Recargar productos después de eliminar
        await this.fetchProductos();
      } catch (err) {
        this.error = err.message || 'Error al eliminar producto';
        throw err; // para manejar error en componente si se desea
      } finally {
        this.loading = false;
      }
    },
  },
});