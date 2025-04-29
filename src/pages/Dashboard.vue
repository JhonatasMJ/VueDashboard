<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/useUserStore";  
import { Users } from "lucide-vue-next";  
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/Sidebar/index.vue";


const userStore = useUserStore();


onMounted(async () => {
  await userStore.fetchUserCount();  
});
</script>

<template>
  <Sidebar />
  <main class="sm:ml-64 p-4 px-8">
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
          <div class="flex flex-col">
            <CardTitle class="text-sm font-medium">Usuários Cadastrados</CardTitle>
            <p class="text-xs text-muted-foreground mt-1">Trilhas de aprendizado disponíveis</p>
          </div>
          <Users class="h-4 w-4 text-marca" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{ userStore.userCount }} <!-- Exibe a contagem de usuários -->
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
          <div class="flex flex-col">
            <CardTitle class="text-sm font-medium">Usuários Cadastrados</CardTitle>
            <p class="text-xs text-muted-foreground mt-1">Trilhas de aprendizado disponíveis</p>
          </div>
          <Users class="h-4 w-4 text-marca" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{ userStore.userCount }} <!-- Exibe a contagem de usuários -->
          </div>
        </CardContent>
      </Card>
    </section>
  </main>
</template>
