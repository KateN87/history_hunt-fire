import { useContext } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

export const useLogout = () => {
	const { dispatch } = useContext(AuthContext);
	const logout = () => {
		signOut(auth)
			.then(() => {
				dispatch({ type: "LOGOUT" });
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	return { logout };
};
