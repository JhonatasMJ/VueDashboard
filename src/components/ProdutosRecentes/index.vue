<script setup>
import { ref, computed, onMounted } from "vue";
import { useProdutosStore } from "@/stores/useProdutoStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PackageCheck } from "lucide-vue-next";
import { dataHoraFormatada } from "@/functions/dataAgora";

const store = useProdutosStore();
const currentPage = ref(1);
const itemsPerPage = 6;

const carregarProdutos = async () => {
  await store.carregarProdutos();
};


const produtosOrdenados = computed(() => {
  return [...store.produtos].sort((a, b) => {
    const numA = parseInt(a.codigo.replace(/\D/g, ""));
    const numB = parseInt(b.codigo.replace(/\D/g, ""));
    return numB - numA;
  });
});

onMounted(() => {
  carregarProdutos();
});
</script>

<template>
  <Card class="w-full flex-1 shadow-md rounded-lg bg-white">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="flex text-lg sm:text-xl text-gray-800">
          Produtos Recentes<span class="text-marca block">.</span>
        </CardTitle>
        <PackageCheck class="w-5 h-5 text-gray-600" />
      </div>
      <CardDescription class="text-gray-600 text-sm">
        Atualizado em {{ dataHoraFormatada }}
      </CardDescription>
    </CardHeader>

    <CardContent class="overflow-x-auto">
      <Table class="w-full text-sm overflow-visible rounded-lg mt-4">
        <TableHeader v-if="produtosOrdenados.length > 0">
          <TableRow>
            <TableHead class="text-left w-1/6">Código</TableHead>
            <TableHead class="text-left w-1/6">Imagem</TableHead>
            <TableHead class="text-left w-1/6">Produto</TableHead>
            <TableHead class="text-left w-1/6">Preço</TableHead>
            <TableHead class="text-left w-1/6">Qtd</TableHead>
            <TableHead class="text-left w-1/6">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="p in produtosOrdenados"
            :key="p.codigo"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <TableCell class="text-gray-900 capitalize">{{ p.codigo }}</TableCell>
            <TableCell class="text-left">
              <Avatar class="w-14 h-14 rounded-sm">
                <AvatarImage :src="p.imagemUrl" :alt="p.produto" />
                <AvatarFallback>{{ p.codigo }}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell class="text-left capitalize text-gray-600">
              <div class="flex flex-col">
                {{ p.produto }}
                <small>{{ p.desc || "Sem Descrição" }}</small>
              </div>
            </TableCell>
            <TableCell class="text-left text-gray-500">
              {{
                Number(p.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </TableCell>
            <TableCell class="text-left text-(--marca) font-bold">{{ p.qtd }}</TableCell>
            <TableCell class="text-left text-(--marca) font-bold">
              {{
                (p.preco * p.qtd).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
