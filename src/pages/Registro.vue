<script setup>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { loginSchema } from "@/schemas/login";
import Loading from "@/components/Loading/index.vue";
import { useUserStore } from "@/stores/useUserStore";

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  email: "",
  password: "",
  nome: "",
});

const errors = reactive({
  email: null,
  password: null,
  nome: null,
});

const userStore = useUserStore();

async function handleSubmit() {
  isLoading.value = true;
  errors.email = null;
  errors.password = null;
  errors.nome = null;

  const result = loginSchema.safeParse(form);

  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });

    toast.error("Preencha os campos corretamente.");
    isLoading.value = false;
    return;
  }

  try {
    await userStore.register(form.email, form.password, form.nome);
    toast.success("Conta criada com sucesso!");
    router.push("/Dashboard");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email já está em uso.");
    } else {
      toast.error("Erro ao tentar criar conta.");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else class="flex h-screen overflow-hidden">
    <Toaster position="top-right" />
    <div class="w-full md:w-1/2 flex items-center justify-center p-8">
      <Card class="w-full max-w-md bg-transparent border-none shadow-none">
        <div class="flex mb-6 mr-12">
          <img src="../../src/assets/logo.webp" alt="Logo" class="w-64" />
        </div>
        <CardHeader class="px-0">
          <CardTitle class="text-4xl text-(--marca) font-bold">
            Crie sua conta
          </CardTitle>
          <CardDescription class="text-zinc-900 text-md mt-4">
            Crie sua conta para começar a usar seu Dashboard.
          </CardDescription>
        </CardHeader>
        <div class="space-y-2 mt-4">
          <Label htmlFor="nome"> Nome </Label>
          <Input
            id="nome"
            type="text"
            placeholder="Digite seu nome"
            v-model="form.nome"
            :class="[ 
              'py-5 focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)', 
              errors.nome ? 'border border-red-500' : 'border border-gray-300' 
            ]"
          />
          <p v-if="errors.nome" class="text-red-500 text-sm">
            {{ errors.nome }}
          </p>
        </div>
        <div class="space-y-2 ">
          <Label htmlFor="email"> Email </Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            v-model="form.email"
            :class="[ 
              'py-5 focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)', 
              errors.email ? 'border border-red-500' : 'border border-gray-300' 
            ]"
          />
          <p v-if="errors.email" class="text-red-500 text-sm">
            {{ errors.email }}
          </p>
        </div>

        <CardContent class="px-0">
          <div class="space-y-2 ">
            <Label htmlFor="password"> Senha </Label>
            <div class="relative">
              <Input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="Digite sua senha"
                v-model="form.password"
                :class="[ 
                  'py-5 pr-12 focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)', 
                  errors.password ? 'border border-red-500' : 'border border-gray-300' 
                ]"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center text-zinc-500 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm">
              {{ errors.password }}
            </p>
          </div>

        </CardContent>

        <CardFooter class="px-0">
          <Button
            class="bg-(--marca) w-full mt-6 cursor-pointer py-5 rounded-sm hover:bg-(--marca)/80"
            @click="handleSubmit"
            :disabled="isLoading"
          >
            {{ isLoading ? "Criando conta..." : "Criar conta" }}
          </Button>
        </CardFooter>
        <div class="flex justify-center gap-2 ">
          <p class=" text-sm text-(--marca)">
            Já tem uma conta?
            <RouterLink to="/" class="font-medium text-(--marca) underline">
              Entrar
            </RouterLink>
          </p>
        </div>
      </Card>
    </div>

    <div class="hidden md:block md:w-1/2 relative">
      <img
        src="../../src/assets/fundo.webp"
        alt="Logo"
        class="object-cover h-full w-full"
      />
    </div>
  </div>
</template>
