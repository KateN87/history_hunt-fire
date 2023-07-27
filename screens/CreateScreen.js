import { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Modal,
	Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";

//firebase & ctxt
import { db } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

//components
import IconButton from "../components/IconButton";
import { PhotoPicker } from "../components/PhotoPicker";

//styles
import { GlobalColors, GlobalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

export const CreateScreen = () => {
	const { user } = useContext(AuthContext);
	const [modalVisible, setModalVisible] = useState(false);
	const [imgUrl, setImgUrl] = useState();
	const navigation = useNavigation();

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

	const onSubmit = async ({ title, time }) => {
		const ref = collection(db, "hunts");
		const createdHunt = await addDoc(ref, {
			title,
			time,
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
									message: "You neeed to name the hunt",
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
					{/* 					<View style={styles.inputContainer}>
						<Text style={GlobalStyles.mediumTitle}>
							Take a profile photo for your hunt!
						</Text>

						<IconButton
							type={"FontAwesome5"}
							icon="camera"
							color={GlobalColors.hotPurple}
							size={64}
							pressHandler={() => setModalVisible(true)}
						/>
					</View> */}
					{/* 					{error && (
						<View style={GlobalStyles.errorContainer}>
							<Text style={GlobalStyles.errorText}>{error}</Text>
						</View>
					)}

					{!isPending && (
						<CustomButton
							title="Log in"
							pressHandler={handleSubmit(onSubmit)}
						/>
					)} */}

					{/* {isPending && ( */}
					<CustomButton
						title="Continue!"
						pressHandler={handleSubmit(onSubmit)}
						/* disabled={true} */
					/>
					{/* )}  */}
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
	},
	inputContainer: {
		marginTop: 20,
	},
	modalView: {
		flex: 1,
	},
});
