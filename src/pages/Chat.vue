
<script setup>
import Sidebar from "@/components/Sidebar/index.vue";
import ChatBot from "@/components/ChatScroll/index.vue";
</script>

<template>
  <Sidebar />
    <main class="sm:ml-64 p-4 px-8">
      <section class="grid grid-cols-1  gap-4">
        <ChatBot />
      </section>
    </main>

</template>