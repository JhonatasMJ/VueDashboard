import { defineStore } from "pinia";
import { ref as dbRef, set, get } from "firebase/database";
import { database } from "../services/firebase";

// Função para gerar código único para cada produto
const gerarCodigo = async () => {
  const produtosRef = dbRef(database, "produtos");
  const snapshot = await get(produtosRef);
  const produtos = snapshot.exists() ? snapshot.val() : {};
  const numeroDeProdutos = Object.keys(produtos).length + 1;
  const codigo = `P${String(numeroDeProdutos).padStart(4, '0')}`;
  return codigo;
};

export const useProdutosStore = defineStore("produtos", {
  state: () => ({
    produtos: [],
  }),
  actions: {
    // Método para adicionar produto
    async createProduto(produto, desc, preco, qtd, imagemUrl) {
      if (!produto || preco === undefined || qtd === undefined || !imagemUrl) {
        throw new Error("Todos os campos devem estar preenchidos.");
      }

      const codigo = await gerarCodigo();
      const produtosRef = dbRef(database, "produtos/" + codigo);

      await set(produtosRef, {
        codigo,
        produto,
        desc,
        preco,
        qtd,
        imagemUrl
      });

      this.addProduto({ codigo, produto, desc, preco, qtd, imagemUrl });
    },

    // Método para buscar produtos do Firebase
    async carregarProdutos() {
      const produtosRef = dbRef(database, "produtos");
      const snapshot = await get(produtosRef);
      const produtos = snapshot.exists() ? snapshot.val() : {};

      const produtosArray = Object.keys(produtos).map(key => produtos[key]);
      this.setProdutos(produtosArray);
    },

    // Método para excluir produto
    async deleteProduto(codigo) {
      const produtosRef = dbRef(database, "produtos/" + codigo);
      await set(produtosRef, null);

      this.removeProduto(codigo);
    },

    // Métodos auxiliares para manipulação local do estado
    setProdutos(produtos) {
      this.produtos = produtos;
    },

    addProduto(produto) {
      this.produtos.push(produto);
    },

    removeProduto(codigo) {
      this.produtos = this.produtos.filter(p => p.codigo !== codigo);
    },
  }
});
