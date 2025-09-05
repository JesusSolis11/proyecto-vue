import { defineStore } from "pinia";
import { getProductos, createProducto, updateProducto, deleteProducto } from "@/api/productos.service";

export const useProductosStore = defineStore("productos", {
  state: () => ({
    loading: false,
    productos: [],
    error: null,
  }),
  actions: {
    async fetchProductos() {
      this.loading = true; this.error = null;
      try {
        const data = await getProductos();
        this.productos = Array.isArray(data) ? data : (data?.data ?? []);
      } catch (e) {
        this.error = e?.message || "Error al cargar productos";
        this.productos = [];
      } finally {
        this.loading = false;
      }
    },
    async addProducto(p) {
      await createProducto(p);
      await this.fetchProductos();
    },
    async editProducto(id, p) {
      await updateProducto(id, p);
      await this.fetchProductos();
    },
    async removeProducto(id) {
      await deleteProducto(id);
      this.productos = this.productos.filter(x => x.id !== id);
    },
  },
});
