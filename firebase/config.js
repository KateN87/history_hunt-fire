import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDIAFqtpBRFuwVDz-IWKuW141zp5gUc7TI",
	authDomain: "historyhunt-a8c4b.firebaseapp.com",
	projectId: "historyhunt-a8c4b",
	storageBucket: "historyhunt-a8c4b.appspot.com",
	messagingSenderId: "287021838956",
	appId: "1:287021838956:web:388a33c7899146fae19e49",
};

//initialize firebase
initializeApp(firebaseConfig);

// init firestore
const db = getFirestore();

//init firebaseAuth
const auth = getAuth();

//init storage
const storage = getStorage();

export { db, auth, storage };
