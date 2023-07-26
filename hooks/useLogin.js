import { useContext, useState } from "react";
import { authenticate } from "../util/https";
import { AuthContext } from "../context/AuthContext";

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false);
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const { dispatch } = useContext(AuthContext);

	const login = async (email, password) => {
		setError(null);
		setIsPending(true);

		try {
			// login
			const res = await authenticate(
				"signInWithPassword",
				email,
				password
			);

			// dispatch login action
			dispatch({
				type: "LOGIN",
				payload: {
					token: res.data.idToken,
					displayName: res.data.displayName,
				},
			});

			setIsPending(false);
			setError(null);
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
	};

	return { login, isPending, error };
};
