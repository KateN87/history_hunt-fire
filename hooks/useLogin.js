import { useContext, useState } from "react";
//firebase
import { auth } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const { dispatch } = useContext(AuthContext);

	const login = async (email, password) => {
		setError(null);
		setIsPending(true);

		try {
			// login
			const res = await signInWithEmailAndPassword(auth, email, password);
			dispatch({ type: "LOGIN", payload: res.user });

			setIsPending(false);
			setError(null);
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
	};

	return { login, isPending, error };
};
