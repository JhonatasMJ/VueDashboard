import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA0UWvpeGOU9hVpigmZ2REawQlVcTH1JWU",
  authDomain: "dashboardvue-96a98.firebaseapp.com",
  projectId: "dashboardvue-96a98",
  storageBucket: "dashboardvue-96a98.firebasestorage.app",
  messagingSenderId: "725390606351",
  appId: "1:725390606351:web:f0500bd2747ccdd6d9e37a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;


