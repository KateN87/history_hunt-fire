import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase/config";
import { View, Text, FlatList } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { SafeAreaView } from "react-native";
export const FindFriends = () => {
	const [documents, setDocuments] = useState(null);

	//real time data collection
	useEffect(() => {
		//1st arg: database we want to connect to, 2nd arg: name of the colleciton

		let ref = collection(db, "users");

		//get documents from 1st arg: reference, 2nd arg function which fires everytime we get data change
		const unsub = onSnapshot(ref, (snapshot) => {
			let results = [];
			snapshot.docs.forEach((doc) => {
				results.push({ ...doc.data() });
			});
			console.log(results);
			setDocuments(results);
		});

		//cleanup function
		return () => unsub();
	}, []);

	if (!documents) {
		return <Text>Loading...</Text>;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: 20 }}>
				<FlatList
					data={documents}
					renderItem={({ item }) => {
						return (
							<View style={{ marginBottom: 10 }}>
								<Text style={{ fontSize: 20 }}>
									{item.displayName}
								</Text>
							</View>
						);
					}}
				/>
			</View>
		</SafeAreaView>
	);
};
