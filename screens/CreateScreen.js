import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";

//firebase & ctxt
import { db } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

//components
import { CustomModal } from "../components/CustomModal";

//styles
import { GlobalColors, GlobalStyles } from "../styles/global";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FindFriends } from "../components/FindFriends";
import { LocationPicker } from "../components/LocationPicker";

export const CreateScreen = () => {
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();
	const route = useRoute();
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [pickedLocation, setPickedLocation] = useState();

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
			setPickedLocation(route.params);
		}
	}, [route]);
	const navigationHandler = () => {
		navigation.navigate("locate");
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
	},
	innerContainer: {
		flex: 1,
		marginTop: 20,
	},
	inputContainer: {
		marginTop: 20,
	},
	modalView: {
		flex: 1,
	},
});
