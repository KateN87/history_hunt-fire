import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation, useRoute } from "@react-navigation/native";
//firebase & ctxt
import { createLocationUrl } from "../util/location";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
//components
import { ShowLocComp } from "../components/ShowLocComp";
import CustomButton from "../components/CustomButton";
import { AvatarList } from "../components/AvatarList";
//styles
import { GlobalStyles, GlobalColors } from "../styles/global";

export const CreateScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [error, setError] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [pickedLocations, setPickedLocations] = useState();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			time: "",
		},
	});

	useEffect(() => {
		if (route.params) {
			if (route.params.locations) {
				setPickedLocations(route.params.locations);
			} else if (route.params.friends) {
				setSelectedFriends(route.params.friends);
			}
		}
	}, [route]);

	const navigationHandler = (location, prop) => {
		navigation.navigate(location, prop);
	};

	const onSubmit = async ({ title, time }) => {
		setError(null);
		setIsPending(true);
		try {
			if (!pickedLocations) {
				throw new Error("All fields must be filled!");
			}

			const ref = collection(db, "hunts");
			await addDoc(ref, {
				title,
				time,
				createdBy: auth.currentUser.uid,
				photoURL: createLocationUrl(pickedLocations),
				pickedLocations,
				selectedFriends,
			});

			reset();
			setIsPending(false);
			navigation.navigate("profile");
		} catch (err) {
			setError(err.message);
			setIsPending(false);
		}
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
						<ShowLocComp
							pickedLocations={pickedLocations}
							setPickedLocations={setPickedLocations}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Text style={GlobalStyles.mediumTitle}>
							Who are going hunting?
						</Text>
						{selectedFriends.length === 0 && (
							<Text style={GlobalStyles.smallTitle}>
								No friends added yet
							</Text>
						)}
						{selectedFriends.length > 0 && (
							<AvatarList
								selectedFriends={selectedFriends}
								imageStyle={styles.image}
							/>
						)}
						<CustomButton
							title="Find friends"
							pressHandler={() =>
								navigationHandler("findfriends")
							}
						/>
					</View>
					{error && (
						<View style={GlobalStyles.errorContainer}>
							<Text style={GlobalStyles.errorText}>{error}</Text>
						</View>
					)}

					{!isPending && (
						<CustomButton
							title="Save Hunt"
							pressHandler={handleSubmit(onSubmit)}
						/>
					)}

					{isPending && (
						<CustomButton title="Saving..." disabled={true} />
					)}
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
		marginHorizontal: 25,
	},
	inputContainer: {
		flex: 1,
		marginVertical: 10,
	},
	modalView: {
		flex: 1,
	},
	image: {
		borderRadius: 100,
		width: 60,
		height: 60,
		borderWidth: 2,
		borderColor: GlobalColors.hotPink,
		margin: 10,
	},
});
