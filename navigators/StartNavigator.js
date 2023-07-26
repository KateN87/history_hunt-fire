import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkloggedin } from "../util/https";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import LogoTitle from "../components/LogoTitle";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
	headerTitle: (props) => <LogoTitle {...props} />,
	headerShadowVisible: false,
};

const options = {
	headerTitleAlign: "center",
	headerTintColor: "purple",
};

export default StartNavigator = () => {
	const { user, dispatch } = useContext(AuthContext);

	useEffect(() => {
		const fetchToken = async () => {
			const token = await AsyncStorage.getItem("appToken");
			if (token) {
				const loggedInUser = await checkloggedin(token);

				if (!loggedInUser.users) {
					return;
				}
				console.log("loggedinuser", loggedInUser);
				const displayName = loggedInUser.users.map((item) =>
					item["providerUserInfo"].map((t) => t["displayName"])
				);
				dispatch({
					type: "LOGIN",
					payload: {
						token,
						displayName,
					},
				});
			}
		};
		fetchToken();
	}, [dispatch]);

	return (
		<Stack.Navigator screenOptions={screenOptions}>
			{!user ? (
				<>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{
							headerTitleAlign: "center",
						}}
					/>
					<Stack.Screen
						name="Signup"
						component={SignupScreen}
						options={options}
					/>
				</>
			) : (
				<Stack.Screen
					name="profile"
					component={ProfileScreen}
					options={{ headerShown: false }}
				/>
			)}
		</Stack.Navigator>
	);
};
