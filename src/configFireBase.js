import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

let config = {
  apiKey: "AIzaSyBEEVA2j4Ti87SwU3TcFijedmwJX8o4SvM",
  authDomain: "add-plus-40c6a.firebaseapp.com",
  projectId: "add-plus-40c6a",
  storageBucket: "add-plus-40c6a.appspot.com",
  messagingSenderId: "798562669408",
  appId: "1:798562669408:web:ca5917035336975eb8c405",
};
const app = initializeApp(config);
const db = getFirestore(app);

export default db;
