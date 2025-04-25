<script setup>
import { ref, computed, onMounted } from 'vue';
import PaginationComponent from '@/components/Pagination/index.vue'; // Atualize o caminho conforme necessário
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar/index.vue";
import { Users } from "lucide-vue-next";
import { dataHoraFormatada } from "@/functions/dataAgora";
import SearchInput from "@/components/Busca/index.vue";
import useUser from "@/hooks/useUser";

const { getUsers } = useUser();
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const usuarios = ref([]);


onMounted(async () => {
  try {
    const allUsers = await getUsers();
    usuarios.value = allUsers ? Object.values(allUsers) : []; 
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
});

const filteredUsuarios = computed(() => {
  return usuarios.value.filter((usuario) =>
    usuario.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedUsuarios = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredUsuarios.value.slice(startIndex, startIndex + itemsPerPage);
});
</script>

<template>
  <Sidebar />
  <main class="sm:ml-64 p-4 px-12">
    <Card class="w-full shadow-md rounded-lg bg-white">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex text-lg sm:text-xl text-gray-800">
            Usuários Recentes<span class="text-marca block">.</span>
          </CardTitle>
          <Users class="w-5 h-5 text-gray-600" />
        </div>
        <CardDescription class="text-gray-600 text-sm">
          Atualizado em {{ dataHoraFormatada }}
        </CardDescription>
      </CardHeader>
      <CardContent class="overflow-x-auto">
        <SearchInput v-model="searchQuery" label="Procurar usuários" />

        <Table class="w-full text-sm overflow-visible rounded-lg mt-4">
          <TableHeader>
            <TableRow>
              <TableHead class=" w-1/2">Nome</TableHead>
              <TableHead class="text-left w-1/2">Email</TableHead>
              <TableHead class="text-left w-1/2">Data de Criação</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="paginatedUsuarios.length > 0">
              <TableRow
                v-for="usuario in paginatedUsuarios"
                :key="usuario.id"
                class="border-b border-gray-200 hover:bg-gray-100"
              >
                <TableCell class="text-left text-gray-900 capitalize">
                  {{ usuario.nome }}
                </TableCell>
                <TableCell class="text-left text-gray-600">
                  {{ usuario.email }}
                </TableCell>
                <TableCell class="text-left text-gray-500">
                  {{ usuario.createdAt }} 
                </TableCell>
                <TableCell class="text-left font-semibold text-marca">
                  {{ usuario.saldo }}
                </TableCell>
                <TableCell class="text-left font-semibold text-marca">
                  {{ usuario.formaPagamento }}
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell colspan="5" class="text-center py-6 text-gray-500">
                  Nenhum usuário encontrado para "{{ searchQuery }}"
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <PaginationComponent
          :total-items="filteredUsuarios.length"
          :items-per-page="itemsPerPage"
          v-model="currentPage"
        />
      </CardContent>
    </Card>
  </main>
</template>
