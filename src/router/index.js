import { createRouter, createWebHistory } from "vue-router";
import Produtos from "@/pages/Produtos.vue";
import Dashboard from "@/pages/Dashboard.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Login from "@/pages/Login.vue";
import Usuarios from "@/pages/Usuarios.vue";
import Registro from "@/pages/Registro.vue";
import Chat from "@/pages/Chat.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {path: "", component: Login,    meta: { title: 'Login' }},
      {path: "Produtos", component: Produtos,   meta: { title: 'Produtos' }},
      { path: "Dashboard", component: Dashboard, meta: { title: 'Dashboard' }},
      {path: "Usuarios", component: Usuarios, meta: { title: 'Usuarios'}},
      {path: "Registro", component: Registro, meta: { title: 'Registro'}},
      {path: "Chat", component: Chat, meta: { title: 'Chat'}}


    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const baseTitle = 'Accesys'
  document.title = to.meta.title
    ? `${baseTitle} | ${to.meta.title}`
    : baseTitle
  next()
})

export default router;
