import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  });