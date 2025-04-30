<script setup>
import ProductCard from "@/components/ChatCard/index.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  botName: {
    type: String,
    required: true
  }
});
</script>

<template>

  <div
    v-if="message.from === 'user'"
    class="bg-(--marca) text-white border-0 p-2 w-3/4 mx-auto shadow-sm rounded-md mb-2"
  >
    <p class="text-sm">{{ message.text }}</p>
    <div class="text-xs text-white/70 text-right mt-1">{{ message.time }}</div>
  </div>


  <div
    v-else-if="message.isRich && !message.isTyping"
    class="border shadow-sm rounded-md mb-2 bg-white"
  >
    <div class="flex items-center gap-2 p-2 pb-1">
      <div class="bg-(--marca)/30 rounded-md p-2">
      <img class="w-4 h-4 " src="../../assets/logoBot.svg" alt="Logo" />
    </div>
      <span class="text-sm font-semibold text-primary">{{ botName }}</span>
    </div>

    <div class="p-2 pt-1">
      <p class="text-sm text-gray-800 whitespace-pre-line">{{ message.text }}</p>
      <div 
        v-if="message.products && message.products.length > 0" 
        class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <ProductCard 
          v-for="(product, pidx) in message.products" 
          :key="pidx"
          :product="product"
        />
      </div>
    </div>

    <div class="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t">
      {{ message.time }}
    </div>
  </div>


  <div
    v-else-if="!message.isRich && !message.isTyping"
    class="border shadow-sm rounded-md mb-2 bg-white"
  >
    <div class="flex items-center gap-2 p-2 pb-1">
    <div class="bg-(--marca)/30 rounded-md p-2">
      <img class="w-4 h-4 " src="../../assets/logoBot.svg" alt="Logo" />
    </div>
      <span class="text-sm font-semibold text-primary">{{ botName }}</span>
    </div>

    <div class="p-2 pt-1">
      <p class="text-sm text-gray-800">{{ message.text }}</p>
    </div>

    <div class="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t">
      {{ message.time }}
    </div>
  </div>


  <div
    v-else-if="message.isTyping"
    class="border shadow-sm rounded-md mb-2 bg-white"
  >
    <div class="flex items-center gap-2 p-2 pb-1">
      <div class="bg-(--marca)/30 rounded-md p-2">
      <img class="w-4 h-4 " src="../../assets/logoBot.svg" alt="Logo" />
    </div>
      <span class="text-sm font-semibold text-primary">{{ botName }}</span>
    </div>

    <div class="p-2 pt-1">
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 bg-(--marca) rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-(--marca) rounded-full animate-bounce delay-200"></div>
        <div class="w-2 h-2 bg-(--marca) rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  </div>
</template>
