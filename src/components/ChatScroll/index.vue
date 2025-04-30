<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Send as SendIcon, Trash2 } from "lucide-vue-next";
import ChatMessage from "@/components/ChatMsg/index.vue";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ConfirmDialog from "@/components/DialogConfirm/index.vue";
const GEMINI_API_KEY = "AIzaSyBfnLlNC-aeaCnwIql_dJn-RHlO38WcwsY";
const FIREBASE_URL =
  "https://dashboardvue-96a98-default-rtdb.firebaseio.com/produtos.json";

const botName = "Accesys Bot";
const input = ref("");
const messages = ref([
  {
    from: "bot",
    text: `Olá! Eu sou ${botName}. Como posso te ajudar?`,
    time: new Date().toLocaleTimeString(),
    isRich: false,
  },
]);

const showModal = ref(false);

const automaticQuestions = ref([
  "Liste todos os produtos",
  "Quantidade de produtos",
  "Produtos Mais baratos",
]);

function scrollToBottom() {
  nextTick(() => {
    setTimeout(() => {
      const container = document.querySelector(".messages-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  });
}

onMounted(() => {
  scrollToBottom();
});

function clearMessages() {
  messages.value = [
    {
      from: "bot",
      text: `Olá! Eu sou ${botName}. Como posso te ajudar?`,
      time: new Date().toLocaleTimeString(),
      isRich: false,
    },
  ];
  scrollToBottom();

  nextTick(() => {
    showModal.value = false;
  });
}

async function sendMessage() {
  if (!input.value.trim()) return;

  const userMsg = input.value;
  input.value = "";
  messages.value.push({
    from: "user",
    text: userMsg,
    time: new Date().toLocaleTimeString(),
    isRich: false,
  });

  const typingId = messages.value.length;
  messages.value.push({
    from: "bot",
    text: "Digitando...",
    time: new Date().toLocaleTimeString(),
    isRich: false,
    isTyping: true,
  });

  scrollToBottom();

  let produtos;
  try {
    const res = await fetch(FIREBASE_URL);
    produtos = await res.json();
  } catch (e) {
    messages.value.pop();
    messages.value.push({
      from: "bot",
      text: "Erro ao acessar o banco de dados.",
      time: new Date().toLocaleTimeString(),
      isRich: false,
    });
    scrollToBottom();
    return;
  }

  const lista = Object.values(produtos).map((p) => ({
    produto: p.produto,
    desc: p.desc,
    preco: p.preco,
    qtd: p.qtd,
    imagemUrl: p.imagemUrl,
  }));

  const prompt = `Você é um atendente formal e objetivo, com uma voz clara e direta. O cliente perguntou: "${userMsg}". 


  Nunca coloque * em nenhuma reposta

  Quando o cliente faz uma pergunta sobre um produto, você deve:
- Responder de forma direta e clara, mencionando o nome do produto, sua descrição, preço e quantidade disponível, não coloque *.
- Se o cliente perguntar pela quantidade de um produto, forneça apenas o número disponível em estoque.
- Sempre que possível, utilize um tom acolhedor, mas profissional.

Se o cliente perguntar algo relacionado a contato, responda de forma amigável:

"Para entrar em contato conosco, você pode nos ligar no número (11) 99999-9999 ou enviar um e-mail para contato@accesys.com.br. Estamos disponíveis de segunda a sexta-feira, das 9h às 18h."


Quando o cliente questionar sobre sua identidade, responda de forma amigável:
"Eu sou o ${botName}, o assistente virtual da Accesys. Como posso ajudá-lo hoje?"

Se a pergunta não estiver relacionada a produtos ou à sua empresa, forneça uma resposta educada e não evasiva, por exemplo:
"Desculpe, não entendi a sua pergunta. Eu sou especializado em ajudar com informações sobre produtos da Accesys. Como posso ajudá-lo com isso?"

Se o cliente estiver perguntando sobre um produto específico, sempre destaque claramente o nome do produto e forneça informações detalhadas. Use a formatação [PRODUTO: nome do produto] para uma resposta estruturada.

Abaixo, você tem uma lista detalhada de produtos disponíveis. Se o cliente fizer uma pergunta sobre qualquer um deles, mencione o nome do produto e forneça as informações relevantes.

Nunca cite o link da imagem do produto

Após perguntar sobre um produto, pergunte se o cliente deseja mais informações sobre outro produto.

Caso alguém pergunte de calorias, qual é o mais calorico ou algo do tipo, faça uma base com o nome e descrição do produto para responder.

Lista de produtos:
${lista
  .map(
    (p) =>
      `Produto: ${p.produto}, Descrição: ${p.desc}, Preço: R$${p.preco}, Quantidade: ${p.qtd}, ImagemURL: ${p.imagemUrl}`
  )
  .join("\n")}`;

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    GEMINI_API_KEY;

  try {
    const result = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await result.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    messages.value.pop();

    if (responseText) {
      const processedResponse = processResponseWithProducts(
        responseText,
        lista
      );
      messages.value.push({
        from: "bot",
        text: processedResponse.text,
        time: new Date().toLocaleTimeString(),
        isRich: true,
        products: processedResponse.products,
      });
    } else {
      messages.value.push({
        from: "bot",
        text: "Não consegui gerar uma resposta. Tente novamente.",
        time: new Date().toLocaleTimeString(),
        isRich: false,
      });
    }

    scrollToBottom();
  } catch (err) {
    messages.value.pop();
    messages.value.push({
      from: "bot",
      text: "Erro ao gerar resposta da IA.",
      time: new Date().toLocaleTimeString(),
      isRich: false,
    });
    scrollToBottom();
  }
}

function processResponseWithProducts(text, produtosList) {
  let processedText = text;
  const mentionedProducts = [];

  const productRegex = /\[PRODUTO: ([^\]]+)\]/g;
  let match;

  while ((match = productRegex.exec(text)) !== null) {
    const productName = match[1].trim();
    const product = produtosList.find(
      (p) => p.produto.toLowerCase() === productName.toLowerCase()
    );

    if (
      product &&
      !mentionedProducts.some((p) => p.produto === product.produto)
    ) {
      mentionedProducts.push(product);
      processedText = processedText.replace(match[0], product.produto);
    }
  }

  produtosList.forEach((product) => {
    if (
      text.toLowerCase().includes(product.produto.toLowerCase()) &&
      !mentionedProducts.some((p) => p.produto === product.produto)
    ) {
      mentionedProducts.push(product);
    }
  });

  return {
    text: processedText,
    products: mentionedProducts,
  };
}

function sendAutomaticQuestion(question) {
  input.value = question;
  sendMessage();
}
</script>

<template>
  <div
    class="flex flex-col h-screen shadow-xl border rounded-md overflow-hidden bg-white"
  >
    <div class="p-3 border-b flex items-center justify-between bg-white">
      <div class="flex items-center gap-4">
        <img class="w-10 h-10" src="../../assets/logoBot.svg" alt="Logo" />
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ botName }}</h1>
          <p class="text-sm text-gray-500">Seu assistente pessoal por IA.</p>
        </div>
      </div>
      <ConfirmDialog
        v-model:show="showModal"
        title="Excluir Conversa"
        description="Tem certeza que deseja excluir essa conversa?"
        :onConfirm="clearMessages"
      >
        <template #trigger>
          <Button
            class="text-xs bg-red-500 hover:bg-red-700 cursor-pointer"
            size="sm"
            @click="showModal = true"
          >
            <Trash2 :size="10" />
            Limpar Conversa
          </Button>
        </template>
      </ConfirmDialog>
    </div>

    <div
      class="flex-1 overflow-y-auto messages-container px-4 py-2 space-y-4 bg-gray-50 "
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['max-w-[85%]', msg.from === 'user' ? 'ml-auto' : 'mr-auto']"
      >
        <ChatMessage :message="msg" :bot-name="botName" />
      </div>
    </div>
    <div class="mt-4 flex gap-2 p-4">
      <Button
        v-for="(question, index) in automaticQuestions"
        :key="index"
        class="flex-1 bg-(--marca) text-white hover:bg-(--marca)/90 rounded-md py-2 cursor-pointer"
        @click="sendAutomaticQuestion(question)"
      >
        {{ question }}
      </Button>
    </div>
    <div class="p-4 border-t bg-white">
      <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
        <Input
          v-model="input"
          type="text"
          placeholder="Digite sua mensagem..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus-visible:ring-(--marca)/30 focus-visible:border-(--marca)"
        />
        <Button
          type="submit"
          class="flex items-center gap-2 px-4 py-3 bg-(--marca) hover:bg-(--marca)/90 text-white rounded-md cursor-pointer"
        >
          <SendIcon class="w-4 h-4" />
          Enviar
        </Button>
      </form>
    </div>
  </div>
</template>


