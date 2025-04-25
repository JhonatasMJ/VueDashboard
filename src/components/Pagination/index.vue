<template>
    <div class="flex items-center justify-center mt-6 space-x-2">
      <button
        @click="prev"
        :disabled="page === 1"
        class="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
  
      <button
        v-for="n in pages"
        :key="n"
        @click="() => updatePage(n)"
        class="h-9 w-9 flex items-center justify-center rounded-md border text-sm font-medium"
        :class="page === n ? 'bg-(--marca) text-white ' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
      >
        {{ n }}
      </button>
  
      <button
        @click="next"
        :disabled="page === totalPages"
        class="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  
  const props = defineProps({
    totalItems: Number,
    itemsPerPage: Number,
    modelValue: Number,
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const page = computed(() => props.modelValue)
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
  
  const pages = computed(() => {
    const arr = []
    for (let i = 1; i <= totalPages.value; i++) arr.push(i)
    return arr
  })
  
  const updatePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      emit('update:modelValue', newPage)
    }
  }
  
  const prev = () => updatePage(page.value - 1)
  const next = () => updatePage(page.value + 1)
  </script>
  