import { useState, useContext } from "react";
//firebase & ctx
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

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
				finishedHunts: [],
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
