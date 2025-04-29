<script setup>
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ListChecks,
  MonitorCog,
  Store,
  Menu,
  LayoutDashboard,
  Users,
  Bot,
  Package
} from "lucide-vue-next";
import NavItem from "@/components/NavItem/index.vue";
import useUser from "@/hooks/useUser";
import ConfirmDialog from "@/components/DialogConfirm/index.vue";

const { user, logout } = useUser();
</script>

<template>
  <div class="flex w-full flex-col bg-muted">
    <aside
      class="fixed inset-y-0 z-10 hidden w-60 border-r bg-background sm:flex flex-col"
    >
      <nav class="flex flex-col items-start gap-8 px-6 py-5">
        <TooltipProvider>
          <RouterLink
            to="/Dashboard"
            class="w-full mt-4 text-center font-bold text-2xl"
          >
            <img src="../../assets/logo.webp" alt="Logo" />
          </RouterLink>
          <Separator class="w-full my-2" />

          <Tooltip>
            <TooltipTrigger as-child>
              <RouterLink
                to="/"
                class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
              >
                <NavItem
                  href="/Dashboard"
                  :icon="LayoutDashboard"
                  label="Dashboard"
                />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <RouterLink
                to="/Produtos"
                class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
              >
                <NavItem href="/Produtos" :icon="Package" label="Produtos" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">Produtos</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <RouterLink
                to="/Usuarios"
                class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
              >
                <NavItem href="/Usuarios" :icon="Users" label="Usuarios" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">Usuários</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <RouterLink
                to="/Chat"
                class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
              >
                <NavItem href="/Chat" :icon="Bot" label="Chat" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right">Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>

      <nav class="mt-auto flex flex-col items-center gap-2 px-2 py-5">
        <template v-if="user">
          <div>
            <p class="capitalize font-bold text-center text-(--marca)">{{ user.displayName }}</p>
            <p class="text-xs text-center  text-muted-foreground">{{ user.email }}</p>

          </div>
          <Separator />
          <ConfirmDialog
            title="Sair da conta"
            description="Tem certeza que deseja sair da sua conta?"
            :onConfirm="logout"
          >
            <template #trigger>
              <Button class="w-full cursor-pointer" variant="destructive">Sair</Button>
            </template>
          </ConfirmDialog>
        </template>
        <template v-else>
          <p class="text-muted-foreground text-xs">Carregando usuário...</p>
        </template>
      </nav>
    </aside>
    <div class="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header
        class="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-b-0 sm:bg-transparent sm:px-6"
      >
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="sm:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Abrir / Fechar Menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" class="w-60 p-0">
            <div class="flex flex-col h-full">
              <div class="flex flex-col items-start gap-8 px-6 py-5">
                <RouterLink to="#" class="w-full mt-4">
                  <img src="../../assets/logo.webp" alt="Logo" class="w-42" />
                </RouterLink>
                <Separator class="w-full my-2" />

                <RouterLink
                  to="/"
                  class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
                >
                  <NavItem
                    href="/Dashboard"
                    :icon="LayoutDashboard"
                    label="Dashboard"
                  />
                </RouterLink>

                <RouterLink
                  to="/Painel"
                  class="flex gap-2 items-center rounded-lg text-muted-foreground transition-colors hover:text-pink-600 w-full"
                >
                  <NavItem href="/Painel" :icon="MonitorCog" label="Painel" />
                </RouterLink>
              </div>

              <div class="mt-auto border-t p-6">
                <div class="flex flex-col">
                  <p class="font-bold">Jhonatas Micael</p>
                  <span class="text-marca font-semibold">Administrador</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h2>Menu</h2>
      </header>
    </div>
  </div>
</template>
