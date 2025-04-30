import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { auth, database } from "@/services/firebase";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const users = ref([]);
  const userCount = ref(0);


  const setUser = (payload) => {
    user.value = payload;
  };


  const register = async (email, password, nome) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nome });
      user.value = userCredential.user;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };


  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      throw error;
    }
  };


  const fetchUserCount = async () => {
    try {
      const usersRef = dbRef(database, "users");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        users.value = data;
        userCount.value = Object.keys(data).length;
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };


  const initAuthListener = () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  };

  return {
    user,
    users,
    userCount,
    setUser,
    register,
    login,
    logout,
    fetchUserCount,
    initAuthListener,
  };
});
