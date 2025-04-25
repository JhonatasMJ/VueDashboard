<template>
  <div class="w-full">
    <Label for="search" class="block text-md text-gray-700">{{ label }} </Label>
    <Input
      id="search"
      v-model="inputValue"
      type="text"
      class="mt-1 p-2 w-full border rounded"
      placeholder="Procure por usuários"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
const props = defineProps({
  label: String,
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
