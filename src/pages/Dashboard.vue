<script setup>
import { onMounted } from "vue";
import { Package, Users } from "lucide-vue-next";  
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/Sidebar/index.vue";
import { useUserStore } from "@/stores/useUserStore";  
import { useProdutosStore } from "@/stores/useProdutoStore";
import ProdutosRecentes from "@/components/ProdutosRecentes/index.vue";



const store = useProdutosStore();
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
            <CardTitle class="text-xl font-medium">Usuários Cadastrados</CardTitle>
            <p class="text-xs text-muted-foreground mt-1">Quantidade de usuários cadastrados</p>
          </div>
          <Users class="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{ userStore.userCount }} 
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
          <div class="flex flex-col">
            <CardTitle class="text-xl font-medium">Produtos Cadastrados</CardTitle>
            <p class="text-xs text-muted-foreground mt-1">Produtos cadastrados no sistema</p>
          </div>
          <Package class="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{store.produtos.length}} 
          </div>
        </CardContent>
      </Card>
    </section>
    <ProdutosRecentes class="mt-4" />
  </main>
</template>
