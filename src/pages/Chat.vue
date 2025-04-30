<template>
  <Sidebar />
  <main class="sm:ml-64 p-6 py-4 flex justify-center items-start min-h-screen ">
    <Card class="w-full  shadow-xl border rounded-2xl p-4 space-y-2">
      <div class="flex items-center gap-4">
        <div>
          <img class="w-12 h-12" src="../assets/logoBot.svg" alt="Logo" />

        </div>
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">{{ botName }}</h1>
          <p class="text-muted-foreground">Seu assistente pessoal alimentado por IA.</p>

        </div>
      </div>

      <ScrollArea class="h-[400px] pr-3 space-y-2  p-4 rounded-lg border">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'w-fit max-w-[80%] px-4 py-2 rounded-2xl text-sm',
            msg.from === 'user'
              ? 'ml-auto bg-blue-600 text-white'
              : 'mr-auto bg-gray-200 text-black'
          ]"
        >
          <span v-if="msg.from !== 'user'" class="font-semibold text-primary">
            {{ botName }}:
          </span>
          {{ msg.text }}
        </div>
      </ScrollArea>

      <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
        <Input
          v-model="input"
          placeholder="Digite sua mensagem..."
          class="flex-1 py-4  focus-visible:ring-(--marca)/30 focus-visible:border-(--marca) "
        />
        <Button type="submit" class="gap-2 bg-(--marca)">
          <SendIcon class="w-4 h-4" />
          Enviar
        </Button>
      </form>
    </Card>
  </main>
</template>

<script setup>
import Sidebar from "@/components/Sidebar/index.vue";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send as SendIcon } from "lucide-vue-next";


const botName = "Accesys Bot";

const messages = ref([
  { from: "bot", text: `Olá! Eu sou ${botName}. Como posso te ajudar?` },
]);

const input = ref("");


function sendMessage() {
  if (!input.value.trim()) return;

  const userMsg = input.value;
  messages.value.push({ from: "user", text: userMsg });
  input.value = "";

  setTimeout(() => {
    messages.value.push({
      from: "bot",
      text: `Você disse: "${userMsg}". Ainda estou aprendendo a responder melhor!`,
    });
  }, 700);
}
</script>
