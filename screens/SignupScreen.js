import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

import { useSignup } from "../hooks/useSignup";

import { GlobalStyles } from "../styles/global";
import { GlobalColors } from "../styles/global";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default LoginScreen = () => {
	const navigation = useNavigation();
	const { signup, isPending, error } = useSignup();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			displayName: "",
			password: "",
		},
	});

	const navigateHandler = () => {
		reset();
		navigation.navigate("Login");
	};

	const onSubmit = ({ email, displayName, password }) => {
		signup(email, password, displayName);
	};

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.innerContainer}>
					<Text style={GlobalStyles.largeTitle}>Sign Up</Text>

					<Controller
						name="email"
						control={control}
						rules={{
							required: {
								value: true,
								message: "Email is required",
							},
							pattern: {
								value: EMAIL_REGEX,
								message: "Please enter a valid email",
							},
						}}
						render={({ field: { onChange, value } }) => (
							<CustomInput
								placeholder="Email"
								onChangeText={onChange}
								value={value}
								error={errors.email}
								errorText={errors?.email?.message}
								keyboardType="email-address"
							/>
						)}
					/>
					<Controller
						name="displayName"
						control={control}
						rules={{
							required: {
								value: true,
								message: "Display Name is required",
							},
						}}
						render={({ field: { onChange, value } }) => (
							<CustomInput
								placeholder="display name"
								onChangeText={onChange}
								value={value}
								error={errors.displayName}
								errorText={errors?.displayName?.message}
							/>
						)}
					/>
					<Controller
						name="password"
						control={control}
						rules={{
							required: {
								value: true,
								message: "Password is required",
							},
						}}
						render={({ field: { onChange, value } }) => (
							<CustomInput
								placeholder="Password"
								onChangeText={onChange}
								value={value}
								error={errors.password}
								errorText={errors?.password?.message}
								secureTextEntry={true}
							/>
						)}
					/>
					{error && (
						<View style={GlobalStyles.errorContainer}>
							<Text style={GlobalStyles.errorText}>{error}</Text>
						</View>
					)}
					{!isPending && (
						<CustomButton
							title="CONTINUE"
							pressHandler={handleSubmit(onSubmit)}
						/>
					)}

					{isPending && (
						<CustomButton
							title="Signing up"
							pressHandler={handleSubmit(onSubmit)}
							disabled={true}
						/>
					)}

					<View style={styles.signupPrompt}>
						<Text style={styles.text}>
							Already have an account?
						</Text>
						<Pressable onPress={navigateHandler}>
							<Text style={styles.linkText}>Log in here</Text>
						</Pressable>
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
		marginTop: 50,
		alignItems: "center",
	},
	signupPrompt: {
		marginTop: 16,
		alignItems: "center",
	},
	text: {
		fontFamily: "nunito-regular",
		color: GlobalColors.mediumGrey,
	},
	linkText: {
		fontFamily: "nunito-bold",
		color: GlobalColors.hotPurple,
	},
});
