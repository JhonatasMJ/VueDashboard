import { defineStore } from "pinia";
import { ref } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";  
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";  

import { auth, database } from "@/services/firebase";  

export const useUserStore = defineStore("user", {
  state: () => ({
    userCount: 0, 
    users: [],    
    user: null,   // Armazenando o usuário autenticado
  }),

  actions: {
    // Registro de usuário
    async register(email, password, nome) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: nome });
        this.user = userCredential.user;
      } catch (error) {
        throw error;
      }
    },

    // Login de usuário
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user; // Armazena o usuário autenticado na store
      } catch (error) {
        throw error;
      }
    },

    // Logout de usuário
    async logout() {
      try {
        await signOut(auth);
        this.user = null; // Remove o usuário da store ao deslogar
      } catch (error) {
        throw error;
      }
    },

    // Buscar contagem de usuários
    async fetchUserCount() {
      try {
        const usersRef = dbRef(database, "users");  
        const snapshot = await get(usersRef); 
        if (snapshot.exists()) {
          const users = snapshot.val();
          this.users = users; 
          this.userCount = Object.keys(users).length; 
        }
      } catch (error) {
        console.error("Erro ao obter usuários:", error);
      }
    },

    setUser(user) {
      this.user = user;
    },
  },
});
