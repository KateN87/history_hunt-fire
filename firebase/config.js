import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//initialize firebase
initializeApp(firebaseConfig);

// init firestore
const db = getFirestore();

//init firebaseAuth
const auth = getAuth();

//init storage
const storage = getStorage();

export { db, auth, storage };
