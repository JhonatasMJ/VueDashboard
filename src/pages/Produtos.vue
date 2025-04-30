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
import { maskCurrency, unmaskCurrency } from "@/functions/mascaraReal";
import { produtoSchema } from "@/schemas/produtos";
const store = useProdutosStore();
const preco = ref(0);
const precoFormatado = ref("R$ 0,00");
const isCadastroDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const produto = ref("");
const desc = ref("");
const qtd = ref(0);
const imagemUrl = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;
const produtoEdit = ref(null);

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

const handleInputPreco = (e) => {
  let onlyDigits = e.target.value.replace(/\D/g, "");
  if (!onlyDigits) {
    preco.value = 0;
    precoFormatado.value = "R$ 0,00";
    return;
  }
  preco.value = parseFloat(onlyDigits) / 100;
  precoFormatado.value = maskCurrency(onlyDigits);
};

const formatarPrecoNaSaida = () => {
  precoFormatado.value = maskCurrency((preco.value * 100).toString());
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
    isCadastroDialogOpen.value = false;
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    toast.error("Erro ao cadastrar produto.");
  }
};

const editarProduto = async () => {
  if (!produtoEdit.value) return;

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
    await store.updateProduto(
      produtoEdit.value.codigo,
      result.data.produto,
      result.data.desc,
      result.data.preco,
      result.data.qtd,
      result.data.imagemUrl
    );
    limparFormulario();
    toast.success("Produto atualizado com sucesso!");
    isEditDialogOpen.value = false;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    toast.error("Erro ao atualizar produto.");
  }
};

const limparFormulario = () => {
  produto.value = "";
  desc.value = "";
  preco.value = 0;
  precoFormatado.value = "R$ 0,00";
  qtd.value = 0;
  imagemUrl.value = "";
  produtoEdit.value = null;
};

const abrirDialogCadastro = () => {
  limparFormulario();
  isCadastroDialogOpen.value = true;
};

const abrirDialogEdicao = (produtoItem) => {
  produtoEdit.value = produtoItem;
  produto.value = produtoItem.produto;
  desc.value = produtoItem.desc || "";
  preco.value = produtoItem.preco;
  precoFormatado.value = maskCurrency((produtoItem.preco * 100).toString());
  qtd.value = produtoItem.qtd;
  imagemUrl.value = produtoItem.imagemUrl || "";
  isEditDialogOpen.value = true;
};

onMounted(() => {
  carregarProdutos();
  precoFormatado.value = maskCurrency(preco.value.toString());
});

const filtredProdutos = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return store.produtos.filter((p) =>
    p?.produto?.toLowerCase().includes(query)
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
      <Dialog v-model:open="isCadastroDialogOpen">
        <CardHeader class="flex justify-between">
          <div class="flex flex-col">
            <CardTitle class="flex text-lg sm:text-xl text-gray-800">
              Produtos Cadastrados<span class="text-(--marca) block">.</span>
            </CardTitle>
            <CardDescription class="text-gray-600 text-sm">
              Atualizado em {{ dataHoraFormatada }}
            </CardDescription>
          </div>
          <DialogTrigger as-child @click="abrirDialogCadastro">
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
                :class="[
                  errors.produto
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.produto" class="text-red-500 text-sm">
                {{ errors.produto }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="desc">Descrição</Label>
              <Input
                id="desc"
                v-model="desc"
                :class="[
                  errors.desc
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.desc" class="text-red-500 text-sm">
                {{ errors.desc }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="preco">Preço</Label>
              <Input
                id="preco"
                v-model="precoFormatado"
                @input="handleInputPreco"
                @blur="formatarPrecoNaSaida"
                :class="[
                  errors.preco
                    ? 'border border-red-500'
                    : 'focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                  'transition-all ease-in-out',
                ]"
              />
              <p v-if="errors.preco" class="text-red-500 text-sm">
                {{ errors.preco }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="qtd">Quantidade</Label>
              <Input
                id="qtd"
                type="number"
                v-model="qtd"
                :class="[
                  errors.qtd
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.qtd" class="text-red-500 text-sm">
                {{ errors.qtd }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="imagemUrl">URL da Imagem</Label>
              <Input
                id="imagemUrl"
                v-model="imagemUrl"
                :class="[
                  errors.imagemUrl
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.imagemUrl" class="text-red-500 text-sm">
                {{ errors.imagemUrl }}
              </p>
            </div>
            <DialogFooter>
              <Button
                class="w-full bg-(--marca) hover:bg-(--marca)/80"
                type="submit"
                >Cadastrar</Button
              >
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog v-model:open="isEditDialogOpen">
        <DialogContent class="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o produto.
            </DialogDescription>
          </DialogHeader>

          <form @submit.prevent="editarProduto" class="space-y-4">
            <div class="space-y-2">
              <Label for="produto">Produto</Label>
              <Input
                id="produto"
                v-model="produto"
                :class="[
                  errors.produto
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.produto" class="text-red-500 text-sm">
                {{ errors.produto }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="desc">Descrição</Label>
              <Input
                id="desc"
                v-model="desc"
                :class="[
                  errors.desc
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.desc" class="text-red-500 text-sm">
                {{ errors.desc }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="preco">Preço</Label>
              <Input
                id="preco"
                v-model="precoFormatado"
                @input="handleInputPreco"
                @blur="formatarPrecoNaSaida"
                :class="[
                  errors.preco
                    ? 'border border-red-500'
                    : 'focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                  'transition-all ease-in-out',
                ]"
              />
              <p v-if="errors.preco" class="text-red-500 text-sm">
                {{ errors.preco }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="qtd">Quantidade</Label>
              <Input
                id="qtd"
                type="number"
                v-model="qtd"
                :class="[
                  errors.qtd
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.qtd" class="text-red-500 text-sm">
                {{ errors.qtd }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="imagemUrl">URL da Imagem</Label>
              <Input
                id="imagemUrl"
                v-model="imagemUrl"
                :class="[
                  errors.imagemUrl
                    ? 'border border-red-500'
                    : ' focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)',
                ]"
              />
              <p v-if="errors.imagemUrl" class="text-red-500 text-sm">
                {{ errors.imagemUrl }}
              </p>
            </div>
            <DialogFooter>
              <Button
                class="w-full bg-(--marca) hover:bg-(--marca)/80"
                type="submit"
                >Atualizar</Button
              >
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
            <TableRow>
              <TableHead class="w-1/6">Código</TableHead>
              <TableHead class="text-left w-1/6">Imagem</TableHead>
              <TableHead class="text-left w-1/6">Produto</TableHead>
              <TableHead class="text-left w-1/6">Preço</TableHead>
              <TableHead class="text-left w-1/6">Qtd</TableHead>
              <TableHead class="text-left w-1/6">Total</TableHead>
              <TableHead class="text-center w-1/6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="produtoItem in paginatedProdutos"
              :key="produtoItem.codigo"
            >
              <TableCell>{{ produtoItem.codigo }}</TableCell>
              <TableCell class="w-16">
                <Avatar class="w-14 h-14 rounded-sm">
                  <AvatarImage
                    :src="produtoItem.imagemUrl"
                    :alt="produtoItem.produto"
                  />
                  <AvatarFallback>{{ produtoItem.codigo }}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell class="text-left capitalize text-gray-600">
                <div class="flex flex-col">
                  {{ produtoItem.produto }}
                  <small>{{ produtoItem.desc || "Sem Descrição" }}</small>
                </div>
              </TableCell>
              <TableCell>{{
                maskCurrency((produtoItem.preco * 100).toString())
              }}</TableCell>
              <TableCell class="font-bold text-(--marca)">{{
                produtoItem.qtd
              }}</TableCell>
              <TableCell class="text-left text-(--marca) font-bold">
                {{
                  (produtoItem.preco * produtoItem.qtd).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )
                }}
              </TableCell>
              <TableCell class="flex justify-center space-x-2 p-4">
                <Button
                  size="sm"
                  class="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  @click="abrirDialogEdicao(produtoItem)"
                >
                  <Pencil class="text-black" />
                </Button>
                <ConfirmDialog
                  title="Excluir Produto"
                  description="Tem certeza que deseja excluir este produto?"
                  :onConfirm="() => excluirProduto(produtoItem.codigo)"
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <template v-if="paginatedProdutos.length > 0">
          <PaginationComponent
            :total-items="filtredProdutos.length"
            :items-per-page="itemsPerPage"
            v-model="currentPage"
          />
        </template>
      </CardContent>
    </Card>
  </main>
</template>
