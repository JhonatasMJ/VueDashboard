<script setup >
import { useRoute } from 'vue-router'
import { computed, defineProps } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
});

const route = useRoute()

const isActive = computed(() => route.path === props.href)
</script>

<template>
  <RouterLink
    :to="props.href"
    class="flex gap-2 items-center rounded-lg relative transition-colors w-full"
    :class="isActive
      ? 'font-bold before:w-1 before:h-full before:bg-orange-600 before:rounded-full before:absolute before:-right-6 before:top-0 text-orange-600'
      : 'text-muted-foreground hover:text-amber-700'"
  >
    <component :is="props.icon" class="h-5 w-5 " />
    <span class="block">{{ props.label }}</span>
  </RouterLink>
</template>


