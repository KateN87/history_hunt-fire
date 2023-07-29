import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase/config";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { SafeAreaView } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { GlobalColors, GlobalStyles } from "../styles/global";

export const FindFriends = ({ selected, setSelected }) => {
	const [documents, setDocuments] = useState(null);

	//real time data collection
	useEffect(() => {
		setSelected([]);
		//1st arg: database we want to connect to, 2nd arg: name of the colleciton

		let ref = collection(db, "users");

		//get documents from 1st arg: reference, 2nd arg function which fires everytime we get data change
		const unsub = onSnapshot(ref, (snapshot) => {
			let results = [];
			snapshot.docs.forEach((doc) => {
				const data = doc.data();
				const modifiedData = {
					value: data.displayName,
					key: data.userId,
				};
				results.push(modifiedData);
			});
			console.log(results);
			setDocuments(results);
		});

		return () => unsub();
	}, []);

	if (!documents) {
		return <Text>Loading...</Text>;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: 20 }}>
				<Text style={GlobalStyles.largeTitle}>Add some friends!</Text>
				<MultipleSelectList
					setSelected={(val) => setSelected(val)}
					data={documents}
					label="Added friends"
					onSelect={() => console.log(selected)}
					fontFamily="nunito-bold"
					fontSize={{ fontSize: 26 }}
					notFoundText="No users found :("
					labelStyles={GlobalStyles.mediumTitle}
					badgeStyles={styles.badge}
					badgeTextStyles={{ fontSize: 20 }}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	badge: {
		backgroundColor: GlobalColors.hotPurple,
		fontSize: 4,
	},
});
