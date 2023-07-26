import { createContext, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			AsyncStorage.setItem("appToken", action.payload.token);
			console.log("displayName", action.payload.displayName);

			return {
				...state,
				token: action.payload.token,
				user: action.payload.displayName,
				isAuthenticated: true,
			};
		case "LOGOUT":
			AsyncStorage.removeItem("appToken");
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
			};
		case "AUTH_IS_READY":
			return { user: action.payload, authIsReady: true };
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		token: null,
		user: null,
		isAuthenticated: false,
	});

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
