import { database } from "../services/firebase";
import { ref as dbRef, set, get } from "firebase/database";


const gerarCodigo = async () => {
  const produtosRef = dbRef(database, "produtos");
  const snapshot = await get(produtosRef);
  const produtos = snapshot.exists() ? snapshot.val() : {};
  const numeroDeProdutos = Object.keys(produtos).length + 1;
  const codigo = `P${String(numeroDeProdutos).padStart(4, '0')}`;
  return codigo;
};


const createProduto = async (produto,desc, preco, qtd, imagemUrl) => {

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
};

const getProdutos = async () => {
  const produtosRef = dbRef(database, "produtos");
  const snapshot = await get(produtosRef);
  return snapshot.exists() ? snapshot.val() : {};
};


const deleteProdutos = async (codigo) => {
  const produtosRef = dbRef(database, "produtos/" + codigo);
  await set(produtosRef, null);
};


const useProdutos = () => {
  return {
    createProduto,
    getProdutos,
    deleteProdutos
  };
};

export default useProdutos;
