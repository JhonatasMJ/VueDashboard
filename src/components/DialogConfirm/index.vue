<template>
    <Dialog>
      <DialogTrigger as-child>
        <slot name="trigger" />
      </DialogTrigger>
  
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{{ description }}</DialogDescription>
  
        <div class="flex justify-end gap-2 mt-4">
          <DialogClose as-child>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" @click="handleConfirm">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  
  const props = defineProps<{
    title: string
    description: string
    onConfirm: () => void
  }>()
  
  const handleConfirm = () => {
    props.onConfirm()
  }
  </script>
  