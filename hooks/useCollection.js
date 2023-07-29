import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config";

//firebase imports
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const useCollection = (coll, _q) => {
	const [documents, setDocuments] = useState(null);

	//set up query without causing infinite loop
	const q = useRef(_q).current;

	//real time data collection
	useEffect(() => {
		//1st arg: database we want to connect to, 2nd arg: name of the colleciton

		let ref = collection(db, coll);

		//collection(db, coll).where('uid', '==', user.uid)
		if (q) {
			ref = query(ref, where(...q));
		}

		//get documents from 1st arg: reference, 2nd arg function which fires everytime we get data change
		const unsub = onSnapshot(ref, (snapshot) => {
			let results = [];
			snapshot.docs.forEach((doc) => {
				results.push({ ...doc.data(), id: doc.id });
			});
			setDocuments(results);
		});

		//cleanup function
		return () => unsub();
	}, [coll, q]);

	return { documents };
};

/* Reuben: "89AVZHME8nZn13HIST3WaMs48BU2";

Kate: "5kGzWkPpVCZ6LvguuQttRzrEqts2";

Superman: "OQLenNsaXNb222e6vxwWR0zLlK53";

Rutan: "y1A7SVaCdePY4McY1gh2nXtQ3tx1" */
