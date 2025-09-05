import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Tu API real de Node.js
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (opcional - para logs o auth)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo de errores globales)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Manejar error de autenticación si es necesario
      console.error('Error de autenticación');
    } else if (error.response?.status >= 500) {
      console.error('Error del servidor');
    }
    
    return Promise.reject(error);
  }
);

// Servicios de productos
export const getProductos = (params = {}) => {
  return api.get('/productos', { params });
};

export const getProducto = (id) => {
  return api.get(`/productos/${id}`);
};

export const crearProducto = (producto) => {
  // Asegurar que los datos estén en el formato correcto para SQL Server
  const productoFormatted = {
    ...producto,
    precio: parseFloat(producto.precio),
    stock: parseInt(producto.stock),
    activo: Boolean(producto.activo),
  };
  return api.post('/productos', productoFormatted);
};

export const actualizarProducto = (id, producto) => {
  // Asegurar que los datos estén en el formato correcto para SQL Server
  const productoFormatted = {
    ...producto,
    precio: parseFloat(producto.precio),
    stock: parseInt(producto.stock),
    activo: Boolean(producto.activo),
  };
  return api.put(`/productos/${id}`, productoFormatted);
};

export const eliminarProducto = (id) => {
  return api.delete(`/productos/${id}`);
};

// Funciones auxiliares para formatear datos desde SQL Server
export const formatearProductoDesdeAPI = (producto) => {
  return {
    ...producto,
    precio: parseFloat(producto.precio),
    stock: parseInt(producto.stock),
    activo: Boolean(producto.activo),
    creadoEn: new Date(producto.creadoEn).toISOString(),
  };
};

export const formatearProductosDesdeAPI = (productos) => {
  return productos.map(formatearProductoDesdeAPI);
};