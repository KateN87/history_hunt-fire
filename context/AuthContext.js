import { createContext, useEffect, useReducer } from "react";
//Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

/* import AsyncStorage from "@react-native-async-storage/async-storage"; */

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			/* AsyncStorage.setItem("appToken", action.payload.token);
			console.log("displayName", action.payload.displayName); */

			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
			};
		case "LOGOUT":
			return {
				...state,
				user: null,
			};
		case "IS_AUTHENTICATED":
			return { user: action.payload, isAuthenticated: true };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
		isAuthenticated: false,
	});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			dispatch({ type: "IS_AUTHENTICATED", payload: user });
			unsub();
		});
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
