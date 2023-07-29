import { useState, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export const useSignup = () => {
	const { dispatch } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);

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
			});

			const ref = collection(db, "users");
			await addDoc(ref, {
				displayName,
				userId: res.user.uid,
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
