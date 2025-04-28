import { z } from "zod";

export const produtoSchema = z.object({
  produto: z.string().min(3, "Produto deve ter pelo menos 3 caracteres"),
  desc: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  preco: z.number().min(0, "Preço deve ser um número positivo"),
  qtd: z.number().min(1, "Quantidade deve ser um número positivo"),
  imagemUrl: z.string().url('URL inválida').optional()
});