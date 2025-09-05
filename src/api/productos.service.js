// axios para manejar peticiones HTTP al backend
import axios from "axios"

// Apunta a la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})


export const getProductos = async () => (await api.get("/productos")).data
export const createProducto = async (p) => (await api.post("/productos", p)).data
export const updateProducto = async (id, p) => (await api.put(`/productos/${id}`, p)).data
export const deleteProducto = async (id) => (await api.delete(`/productos/${id}`)).data

// Exporta la función getProductos
export default { getProductos, createProducto, updateProducto, deleteProducto }
