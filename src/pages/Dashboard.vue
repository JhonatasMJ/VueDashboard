<script setup>
import { ref, onMounted } from "vue";
import { Users } from "lucide-vue-next";
import  getUsers  from "@/hooks/useUser";  
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/Sidebar/index.vue";
const userCount = ref(0);

onMounted(async () => {
  try {
    const users =  getUsers(); 
    if (users) {
      userCount.value = Array.isArray(users) ? users.length : Object.keys(users).length ;
    }
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
  }
});
</script>

<template>
  <Sidebar />
  <main className="sm:ml-64 p-4 px-8">
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
          <div className="flex flex-col ">
            <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Trilhas de aprendizado disponíveis</p>
          </div>
          <Users className="h-4 w-4 text-marca" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{ userCount }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
          <div className="flex flex-col ">
            <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Trilhas de aprendizado disponíveis</p>
          </div>
          <Users className="h-4 w-4 text-marca" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold mt-1">
            {{ userCount }}
          </div>
        </CardContent>
      </Card>
    </section>
  </main>
</template>
