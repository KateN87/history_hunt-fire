import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";

//firebase & ctxt
import { db } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

//components
import { CustomModal } from "../components/CustomModal";
import { FindFriendsScreen } from "./FindFriendsScreen";
import { LocationPicker } from "../components/LocationPicker";

//styles
import { GlobalColors, GlobalStyles } from "../styles/global";
import CustomButton from "../components/CustomButton";
import { AvatarList } from "../components/AvatarList";

export const CreateScreen = () => {
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();
	const route = useRoute();
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [pickedLocation, setPickedLocation] = useState();
	const [friendList, setFriendList] = useState([]);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (route.params) {
			if (route.params.locations) {
				setPickedLocation(route.params.locations);
			} else if (route.params.friends) {
				setSelectedFriends(route.params.friends);

				const getFriendNames = async () => {
					const updatedList = await Promise.all(
						route.params.friends.map(async (friend) => {
							const q = query(
								collection(db, "users"),
								where("__name__", "==", friend)
							);
							const querySnapshot = await getDocs(q);
							const friendData = querySnapshot.docs.map((doc) =>
								doc.data()
							);
							return {
								userId: friend,
								displayName: friendData[0].displayName,
								photoURL: friendData[0].photoURL,
							};
						})
					);

					setFriendList(updatedList);
					console.log("updated list: ", updatedList);
				};
				getFriendNames();
			}
		}
	}, [route]);

	const navigationHandler = (location, prop) => {
		navigation.navigate(location, prop);
	};

	const onSubmit = async ({ title, time }) => {
		const createdBy = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			id: user.uid,
		};

		const ref = collection(db, "hunts");
		const createdHunt = await addDoc(ref, {
			title,
			time,
			createdBy,
		});

		console.log("CREATED", createdHunt);
		reset();
		navigation.navigate("profile");
	};

	return (
		<View style={styles.container}>
			<Text style={GlobalStyles.largeTitle}>Create Hunt</Text>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.innerContainer}>
					<View style={styles.inputContainer}>
						<Text style={GlobalStyles.mediumTitle}>
							What is the name of your hunt?
						</Text>
						<Controller
							name="title"
							control={control}
							rules={{
								required: {
									value: true,
									message: "You need to name the hunt",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<CustomInput
									placeholder="Name your hunt!"
									onChangeText={onChange}
									value={value}
									error={errors.title}
									errorText={errors?.title?.message}
								/>
							)}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Text style={GlobalStyles.mediumTitle}>
							How long should it be?
						</Text>
						<Controller
							name="time"
							control={control}
							rules={{
								required: {
									value: true,
									message:
										"You need to set a time length for the hunt",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<CustomInput
									placeholder="3 hours? 2 days? You decide."
									onChangeText={onChange}
									value={value}
									error={errors.time}
									errorText={errors?.time?.message}
								/>
							)}
						/>
					</View>

					<View style={styles.inputContainer}>
						<LocationPicker
							pickedLocation={pickedLocation}
							setPickedLocation={setPickedLocation}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Text style={GlobalStyles.mediumTitle}>
							Who are going hunting?
						</Text>
						{friendList.length === 0 && (
							<Text style={GlobalStyles.smallTitle}>
								No friends added yet
							</Text>
						)}
						<AvatarList avatarArray={friendList} />
						<CustomButton
							title="Find friends"
							pressHandler={() =>
								navigationHandler("findfriends")
							}
						/>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		paddingBottom: 20,
	},
	innerContainer: {
		flex: 1,
		marginTop: 20,
	},
	inputContainer: {
		margin: 25,
	},
	modalView: {
		flex: 1,
	},
});
