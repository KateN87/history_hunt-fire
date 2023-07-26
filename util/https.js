import axios from "axios";

const API_KEY = "AIzaSyAKhmZQ8ugn9riIygi_47_46FyoxU7qlH8";

export const authenticate = async (mode, email, password) => {
	try {
		const resp = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
			{
				email,
				password,
				returnSecureToken: true,
			}
		);
		return resp;
	} catch (err) {
		throw new Error(`${err.response.data.error.message}`);
	}
};

export const checkloggedin = async (idToken) => {
	try {
		const res = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
			{ idToken }
		);

		return res.data;
	} catch (err) {
		return false;
	}
};

export const updateDisplayName = async (idToken, newName) => {
	try {
		const res = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
			{ idToken, displayName: newName }
		);

		return res.data;
	} catch (err) {
		throw new Error(`${err.response.data.error.message}`);
	}
};

export const updatePhotoURL = async (idToken, URL) => {
	try {
		const res = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
			{ idToken, photoURL: URL }
		);

		return res.data;
	} catch (err) {
		throw new Error(`${err.response.data.error.message}`);
	}
};
