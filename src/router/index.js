import { createRouter, createWebHistory } from "vue-router";
import Painel from "@/pages/Painel.vue";
import Dashboard from "@/pages/Dashboard.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Login from "@/pages/Login.vue";
import Usuarios from "@/pages/Usuarios.vue";
import Registro from "@/pages/Registro.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {path: "", component: Login,    meta: { title: 'Login' }},
      {path: "Painel", component: Painel,   meta: { title: 'Painel' }},
      { path: "Dashboard", component: Dashboard, meta: { title: 'Dashboard' }},
      {path: "Usuarios", component: Usuarios, meta: { title: 'Usuarios'}},
      {path: "Registro", component: Registro, meta: { title: 'Registro'}}


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
