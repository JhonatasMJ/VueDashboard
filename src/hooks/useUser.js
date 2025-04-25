import { ref } from "vue";
import { auth, database } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { ref as dbRef, set, update, get } from "firebase/database"; 

const currentUser = ref(null);


onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});


const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    currentUser.value = user;

    const userRef = dbRef(database, "users/" + user.uid);
    await update(userRef, {
      lastLogin: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro no login:", err.code, err.message);
    throw err;
  }
};


const register = async (email, password, nome) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: nome,
    });

    currentUser.value = user;

    const userRef = dbRef(database, "users/" + user.uid);
    await set(userRef, {
      nome,
      email: user.email,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro no registro:", err.code, err.message);
    throw err;
  }
};


const logout = async () => {
  await signOut(auth);
  currentUser.value = null;
};


const getUsers = async () => {
  try {
    const usersRef = dbRef(database, "users");
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      return snapshot.val(); 
    } else {
      console.log("Nenhum usuário encontrado.");
      return null;
    }
  } catch (err) {
    console.error("Erro ao obter usuários:", err.code, err.message);
    throw err;
  }
};


const useUser = () => {
  return {
    user: currentUser,
    login,
    register,
    logout,
    getUsers, 
  };
};

export default useUser;
