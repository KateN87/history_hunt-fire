import { useState, useEffect, useContext } from "react";
import { authenticate, updateDisplayName } from "../util/https";
import { AuthContext } from "../context/AuthContext";

export const useSignup = () => {
	const { dispatch } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);

	const signup = async (email, password, displayName /* thumbnail */) => {
		setError(null);
		setIsPending(true);

		try {
			const res = await authenticate("signUp", email, password);

			//upload user thumbnail to folder thumbnails/ folder user-id/ filename
			/* const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
			const img = await projectStorage.ref(uploadPath).put(thumbnail);
			const imgUrl = await img.ref.getDownloadURL(); */

			// add display name to user
			const newName = await updateDisplayName(
				res.data.idToken,
				displayName
			);

			dispatch({
				type: "LOGIN",
				payload: { token: res.data.idToken, displayName },
			});

			//create a user document - with the same id as the uid
			/* await projectFirestore.collection("users").doc(res.user.uid).set({
				online: true,
				displayName,
				photoURL: imgUrl,
			}); */

			// dispatch login action
			/* dispatch({ type: "LOGIN", payload: res.user }); */

			setIsPending(false);
			setError(null);
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
	};

	return { signup, error, isPending };
};
