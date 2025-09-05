<template>
  <div id="app">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <img alt="Vue logo" class="h-10 w-10 mr-3" src="@/assets/logo.svg" />
            <h1 class="text-xl font-semibold text-gray-900">Gestión de Productos</h1>
          </div>

          <!-- Navigation -->
          <nav class="flex space-x-8">
            <RouterLink 
              to="/productos" 
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 border-b-2 border-blue-600"
            >
              Productos
            </RouterLink>
            <RouterLink 
              to="/productos/crear" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Crear Producto
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.router-link-active {
  @apply text-blue-600;
}
</style>