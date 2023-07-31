import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { SafeAreaView } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { GlobalColors, GlobalStyles } from "../styles/global";
import IconButton from "../components/IconButton";
import { Alert } from "react-native";

export const FindFriendsScreen = ({ navigation }) => {
	const [documents, setDocuments] = useState(null);
	const [selectedFriends, setSelectedFriends] = useState([]);

	const saveSelectedFriends = useCallback(() => {
		if (selectedFriends.length <= 0) {
			Alert.alert(
				"No friends selected",
				"You have to add at least one friend"
			);
			return;
		}
		navigation.navigate("create", { friends: selectedFriends });
	}, [navigation, selectedFriends]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					type="FontAwesome5"
					icon="save"
					size={38}
					color={tintColor}
					pressHandler={saveSelectedFriends}
				/>
			),
		});
	}, [navigation, saveSelectedFriends]);
	//real time data collection
	useEffect(() => {
		setSelectedFriends([]);
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
					setSelected={(val, key) => setSelectedFriends(val)}
					data={documents}
					label="Added friends"
					onSelect={() => console.log("SELECTED", selectedFriends)}
					fontFamily="nunito-bold"
					inputStyles={{ fontSize: 20 }}
					dropdownTextStyles={{ fontSize: 20 }}
					notFoundText="No users found :("
					labelStyles={GlobalStyles.mediumTitle}
					badgeStyles={styles.badge}
					badgeTextStyles={{ fontSize: 20 }}
					placeholder="Select friends"
					boxStyles={{ borderColor: GlobalColors.softPurple }}
					dropdownStyles={{ borderColor: GlobalColors.softPurple }}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	badge: {
		backgroundColor: GlobalColors.softPurple,
		fontSize: 4,
	},
});
