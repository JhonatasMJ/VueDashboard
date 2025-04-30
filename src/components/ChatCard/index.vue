<script setup>
import { Package, ShoppingBag } from "lucide-vue-next";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="border shadow-sm overflow-hidden rounded-md mb-3 bg-white">
    <div class="flex">
      <div class="w-20 h-20 overflow-hidden bg-white border-r flex items-center justify-center">
        <img 
          v-if="product.imagemUrl" 
          :src="product.imagemUrl" 
          :alt="product.produto"
          class="object-contain w-full h-full" 
        />
        <div v-else class="flex flex-col items-center justify-center h-full w-full text-gray-300">
          <Package class="h-6 w-6 mb-1" />
          <span class="text-xs">Sem imagem</span>
        </div>
      </div>

      <div class="p-2 flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-sm">{{ product.produto }}</h3>
          <span
            v-if="product.qtd > 0"
            class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded"
          >
            Disponível
          </span>
          <span
            v-else
            class="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded"
          >
            Indisponível
          </span>
        </div>
        <p class="text-xs text-gray-600 line-clamp-2">{{ product.desc }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="font-semibold text-green-600 text-sm">
            R$ {{ product.preco }}
          </span>
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <ShoppingBag class="h-3 w-3" />
            {{ product.qtd }} un.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
