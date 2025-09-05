import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // URL base de tu backend
  timeout: 5000,
});

export const getProductos = (params = {}) => api.get('/productos', { params });
export const getProducto = (id) => api.get(`/productos/${id}`);
export const crearProducto = (producto) => api.post('/productos', producto);
export const actualizarProducto = (id, producto) => api.put(`/productos/${id}`, producto);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);