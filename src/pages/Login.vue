<script setup>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "vue-sonner";
import { Eye, EyeOff } from "lucide-vue-next";
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
});

const errors = reactive({
  email: null,
  password: null,
});

const userStore = useUserStore();

async function handleSubmit() {
  isLoading.value = true;
  errors.email = null;
  errors.password = null;

  const result = loginSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });

    toast.error("Email ou senha incorretos.");
    isLoading.value = false;
    return;
  }

  try {
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    await userStore.login(email, password);  
   
    if (userStore.user) {
      router.push({ path: "/Dashboard" });
    } else {
      toast.error("Erro ao autenticar. Tente novamente.");
    }
  } catch (error) {

    if (error.code === "auth/user-not-found") {
      toast.error("Usuário não encontrado.");
    } else if (error.code === "auth/wrong-password") {
      toast.error("Senha incorreta.");
    } else if (error.code === "auth/invalid-email") {
      toast.error("Email inválido.");
    } else {
      toast.error("Erro ao tentar fazer login.");
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
            Olá novamente
          </CardTitle>
          <CardDescription class="text-zinc-900 text-md mt-4">
            Faça login para começar a usar seu Dashboard.
          </CardDescription>
        </CardHeader>
        <div class="space-y-2 mt-4">
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

          <div class="flex items-center justify-between mt-4 w-full">
            <div class="flex items-center justify-between  ">
              <Checkbox id="remember-me" />
              <Label
                htmlFor="remember-me"
                class="text-sm font-normal cursor-pointer ml-2"
              >
                Lembrar-me
              </Label>
            </div>
          </div>
        </CardContent>

        <CardFooter class="px-0">
          <Button
            class="bg-(--marca) w-full mt-6 cursor-pointer py-5 rounded-sm hover:bg-(--marca)/80"
            @click="handleSubmit"
            :disabled="isLoading"
          >
            {{ isLoading ? "Entrando..." : "Entrar" }}
          </Button>
        </CardFooter>
        <div class="flex justify-center gap-2 ">
          <p class=" text-sm text-(--marca)">
            Não tem uma conta?
            <RouterLink
              to="/Registro"
              class="font-medium text-(--marca) underline"
            >
              Criar conta
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
