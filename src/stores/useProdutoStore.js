import { defineStore } from "pinia";
import {
  ref as dbRef,
  set,
  get,
  remove,
  runTransaction,
} from "firebase/database";
import { database } from "../services/firebase";

export const useProdutosStore = defineStore("produtos", {
  state: () => ({
    produtos: [],
  }),

  actions: {
    async createProduto(produto, desc, preco, qtd, imagemUrl) {
      if (!produto || preco === undefined || qtd === undefined || !imagemUrl) {
        throw new Error("Todos os campos devem estar preenchidos.");
      }

      const contadorRef = dbRef(database, "contadorProdutos");

      const novoCodigo = await runTransaction(contadorRef, (current) => {
        return (current || 0) + 1;
      }).then((result) => {
        if (result.committed) {
          const numero = result.snapshot.val();
          return `P${String(numero).padStart(3, "0")}`;
        } else {
          throw new Error("Falha ao gerar código do produto.");
        }
      });

      const produtoRef = dbRef(database, `produtos/${novoCodigo}`);

      const novoProduto = {
        codigo: novoCodigo,
        produto,
        desc,
        preco,
        qtd,
        imagemUrl,
        createdAt: new Date().toISOString(), 
      };

      await set(produtoRef, novoProduto);
      this.addProduto(novoProduto);
    },

    async carregarProdutos() {
      const produtosRef = dbRef(database, "produtos");
      const snapshot = await get(produtosRef);
      const produtos = snapshot.exists() ? snapshot.val() : {};
      const produtosArray = Object.values(produtos);

      produtosArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      this.setProdutos(produtosArray);
    },

    async deleteProduto(codigo) {
      const produtoRef = dbRef(database, `produtos/${codigo}`);
      await remove(produtoRef);
      this.removeProduto(codigo);
    },

    setProdutos(produtos) {
      this.produtos = produtos;
    },

    addProduto(produto) {
      this.produtos.unshift(produto); 
    },

    removeProduto(codigo) {
      this.produtos = this.produtos.filter((p) => p.codigo !== codigo);
    },

    getAllProdutos() {
      return this.produtos;
    },
  },
});
