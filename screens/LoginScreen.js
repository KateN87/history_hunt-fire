import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
//Hooks and components
import { useLogin } from "../hooks/useLogin";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
//styles
import { GlobalStyles, GlobalColors } from "../styles/global";

const EMAIL_REGEX =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default LoginScreen = () => {
	const navigation = useNavigation();
	const { login, error, isPending } = useLogin();
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

	const navigateHandler = () => {
		reset();
		navigation.navigate("Signup");
	};

	const onSubmit = async ({ email, password }) => {
		login(email, password);
	};

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.innerContainer}>
					<Text style={GlobalStyles.largeTitle}>Log In</Text>
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
							title="Log in"
							pressHandler={handleSubmit(onSubmit)}
						/>
					)}

					{isPending && (
						<CustomButton
							title="Logging in"
							pressHandler={handleSubmit(onSubmit)}
							disabled={true}
						/>
					)}

					<View style={styles.signupPrompt}>
						<Text style={styles.text}>
							Need to make an account?
						</Text>
						<Pressable onPress={navigateHandler}>
							<Text
								style={[
									GlobalStyles.mediumTitle,
									styles.linkText,
								]}
							>
								Sign up here
							</Text>
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
		fontSize: 20,
	},
	linkText: {
		color: GlobalColors.hotPurple,
	},
});
