<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useProdutosStore } from "@/stores/useProdutoStore";
import { toast } from "vue-sonner";
import PaginationComponent from "@/components/Pagination/index.vue";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import Sidebar from "@/components/Sidebar/index.vue";
import SearchInput from "@/components/Busca/index.vue";
import { dataHoraFormatada } from "@/functions/dataAgora";
import ConfirmDialog from "@/components/DialogConfirm/index.vue";


import { produtoSchema } from "@/schemas/produtos";

const store = useProdutosStore();

const isDialogOpen = ref(false);
const produto = ref("");
const desc = ref("");
const preco = ref(0);
const qtd = ref(0);
const imagemUrl = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;


const errors = reactive({
  produto: null,
  desc: null,
  preco: null,
  qtd: null,
  imagemUrl: null,
});

const carregarProdutos = async () => {
  await store.carregarProdutos();
};

const cadastrarProduto = async () => {
  errors.produto = null;
  errors.desc = null;
  errors.preco = null;
  errors.qtd = null;
  errors.imagemUrl = null;

  const result = produtoSchema.safeParse({
    produto: produto.value,
    desc: desc.value,
    preco: Number(preco.value),
    qtd: Number(qtd.value),
    imagemUrl: imagemUrl.value || undefined,
  });

  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    toast.error("Preencha corretamente os campos.");
    return;
  }

  try {
    await store.createProduto(
      result.data.produto,
      result.data.desc,
      result.data.preco,
      result.data.qtd,
      result.data.imagemUrl
    );
    limparFormulario();
    toast.success("Produto cadastrado com sucesso!");
    isDialogOpen.value = false; 
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    toast.error("Erro ao cadastrar produto.");
  }
};

const limparFormulario = () => {
  produto.value = "";
  desc.value = "";
  preco.value = 0;
  qtd.value = 0;
  imagemUrl.value = "";
};

onMounted(() => {
  carregarProdutos();
});

const filtredProdutos = computed(() => {
  return store.produtos.filter((p) =>
    p.produto.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedProdutos = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filtredProdutos.value.slice(startIndex, startIndex + itemsPerPage);
});

const excluirProduto = (codigo) => {
  store.deleteProduto(codigo);
};
</script>


<template>
  <Sidebar />
  <main class="sm:ml-64 p-4 px-12">
    <Card class="w-full shadow-md rounded-lg bg-white">
      <Dialog  v-model:open="isDialogOpen">
        <CardHeader class="flex justify-between">
          <div class="flex flex-col">
            <CardTitle class="flex text-lg sm:text-xl text-gray-800">
              Produtos Cadastrados<span class="text-(--marca) block">.</span>
            </CardTitle>
            <CardDescription class="text-gray-600 text-sm">
              Atualizado em {{ dataHoraFormatada }}
            </CardDescription>
          </div>
          <DialogTrigger as-child @click="isDialogOpen = true">
            <Button class="bg-(--marca) hover:bg-(--marca)/80 cursor-pointer">
              <Plus />
              Cadastrar Produto
            </Button>
          </DialogTrigger>
        </CardHeader>
        <DialogContent class="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo produto.
            </DialogDescription>
          </DialogHeader>

          <form @submit.prevent="cadastrarProduto" class="space-y-4">
            <div class="space-y-2">
              <Label for="produto">Produto</Label>
              <Input
                id="produto"
                v-model="produto"
                :class="[errors.produto ? 'border border-red-500' : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)']"
              />
              <p v-if="errors.produto" class="text-red-500 text-sm">{{ errors.produto }}</p>
            </div>
            <div class="space-y-2">
              <Label for="desc">Descrição</Label>
              <Input
                id="desc"
                v-model="desc"
                :class="[errors.desc ? 'border border-red-500' : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)']"
              />
              <p v-if="errors.desc" class="text-red-500 text-sm">{{ errors.desc }}</p>
            </div>
            <div class="space-y-2">
              <Label for="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                v-model="preco"
                :class="[errors.preco ? 'border border-red-500' : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)']"
              />
              <p v-if="errors.preco" class="text-red-500 text-sm">{{ errors.preco }}</p>
            </div>
            <div class="space-y-2">
              <Label for="qtd">Quantidade</Label>
              <Input
                id="qtd"
                type="number"
                v-model="qtd"
                :class="[errors.qtd ? 'border border-red-500' : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)']"
              />
              <p v-if="errors.qtd" class="text-red-500 text-sm">{{ errors.qtd }}</p>
            </div>
            <div class="space-y-2">
              <Label for="imagemUrl">URL da Imagem</Label>
              <Input
                id="imagemUrl"
                v-model="imagemUrl"
                :class="[errors.imagemUrl ? 'border border-red-500' : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)']"
              />
              <p v-if="errors.imagemUrl" class="text-red-500 text-sm">{{ errors.imagemUrl }}</p>
            </div>
            <DialogFooter>
              <Button class="w-full bg-(--marca) hover:bg-(--marca)/80" type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <CardContent class="overflow-x-auto">
        <SearchInput
          v-model="searchQuery"
          label="Procurar produtos"
          placeholder="Digite o nome do produto"
        />
        <Table class="w-full text-sm overflow-visible rounded-lg mt-4">
          <TableHeader>
            <template v-if="paginatedProdutos.length > 0">
              <TableRow>
                <TableHead class="w-1/6">Código</TableHead>
                <TableHead class="text-left w-1/6">Imagem</TableHead>
                <TableHead class="text-left w-1/6">Produto</TableHead>
                <TableHead class="text-left w-1/6">Preço</TableHead>
                <TableHead class="text-left w-1/6">Qtd</TableHead>
                <TableHead class="text-left w-1/6">Total</TableHead>
                <TableHead class="text-center w-1/6">Ações</TableHead>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell colspan="7" class="text-center py-6 text-gray-500">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            </template>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="p in paginatedProdutos"
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
                  <small>{{ p.desc || 'Sem Descrição' }}</small>
                </div>
              </TableCell>
              <TableCell class="text-left text-gray-500">R${{ p.preco }}</TableCell>
              <TableCell class="text-left text-(--marca) font-bold">{{ p.qtd }}</TableCell>
              <TableCell class="text-left text-gray-500">R${{ p.preco * p.qtd }}</TableCell>
              <TableCell class="text-left text-gray-500">
                <div class="flex gap-2 justify-center p-4">
                  <Button size="sm" variant="outline">
                    <Pencil :size="10" />
                  </Button>
                  <ConfirmDialog
                    title="Excluir produto"
                    description="Tem certeza que deseja excluir este produto?"
                    :onConfirm="() => excluirProduto(p.codigo)"
                  >
                    <template #trigger>
                      <Button
                        class="text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                        size="sm"
                      >
                        <Trash2 :size="10" />
                      </Button>
                    </template>
                  </ConfirmDialog>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <PaginationComponent
          :total-items="filtredProdutos.length"
          :items-per-page="itemsPerPage"
          v-model="currentPage"
        />
      </CardContent>
    </Card>
  </main>
</template>

