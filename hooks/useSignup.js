import { useState, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const useSignup = () => {
	const { dispatch } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const defaultPhotoURL =
		"https://firebasestorage.googleapis.com/v0/b/historyhunt-a8c4b.appspot.com/o/profilephotos%2FAnonymousProfilePic.png?alt=media&token=18bd054d-bdcb-4e89-ad20-b53c9e832a25";

	const signup = async (email, password, displayName /* thumbnail */) => {
		setError(null);
		setIsPending(true);

		try {
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await updateProfile(auth.currentUser, {
				displayName,
				photoURL: defaultPhotoURL,
			});

			await setDoc(doc(db, "users", res.user.uid), {
				displayName,
				photoURL: defaultPhotoURL,
			});

			dispatch({ type: "LOGIN", payload: res.user });
			setIsPending(false);
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
	};

	return { signup, error, isPending };
};
