import { useState, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

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

			dispatch({ type: "LOGIN", payload: res.user });
			setIsPending(false);
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
	};

	return { signup, error, isPending };
};
