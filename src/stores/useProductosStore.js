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
          let aVal = a[campo];
          let bVal = b[campo];
          
          // Manejar comparación de strings
          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
          
          if (aVal < bVal) return direccion === 'asc' ? -1 : 1;
          if (aVal > bVal) return direccion === 'asc' ? 1 : -1;
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
        const response = await productosService.getProductos();
        // Formatear datos de SQL Server si es necesario
        this.productos = Array.isArray(response.data) 
          ? productosService.formatearProductosDesdeAPI(response.data)
          : [];
        console.log('Productos cargados:', this.productos.length);
      } catch (err) {
        this.error = this.extractErrorMessage(err);
        console.error('Error fetching productos:', err);
        this.productos = [];
      } finally {
        this.loading = false;
      }
    },

    async obtenerProducto(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productosService.getProducto(id);
        const producto = productosService.formatearProductoDesdeAPI(response.data);
        this.productoSeleccionado = producto;
        return producto;
      } catch (err) {
        this.error = this.extractErrorMessage(err);
        console.error('Error fetching producto:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async crearProducto(producto) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productosService.crearProducto(producto);
        // Recargar productos después de crear
        await this.fetchProductos();
        return response.data;
      } catch (err) {
        this.error = this.extractErrorMessage(err);
        console.error('Error creating producto:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async actualizarProducto(id, producto) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productosService.actualizarProducto(id, producto);
        // Recargar productos después de actualizar
        await this.fetchProductos();
        return response.data;
      } catch (err) {
        this.error = this.extractErrorMessage(err);
        console.error('Error updating producto:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async eliminarProducto(id) {
      this.loading = true;
      this.error = null;
      try {
        await productosService.eliminarProducto(id);
        // Recargar productos después de eliminar
        await this.fetchProductos();
      } catch (err) {
        this.error = this.extractErrorMessage(err);
        console.error('Error deleting producto:', err);
        throw err;
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
      this.page = 1; // Reset to first page when searching
    },

    setSort(sort) {
      this.sort = sort;
    },

    setProductoSeleccionado(producto) {
      this.productoSeleccionado = producto;
    },

    clearError() {
      this.error = null;
    },

    // Método auxiliar para extraer mensajes de error
    extractErrorMessage(error) {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.data?.error) {
        return error.response.data.error;
      }
      if (error.response?.statusText) {
        return `Error ${error.response.status}: ${error.response.statusText}`;
      }
      if (error.message) {
        return error.message;
      }
      return 'Error desconocido';
    },
  },
});