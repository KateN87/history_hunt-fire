import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import LogoTitle from "../components/LogoTitle";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";
import { Text } from "react-native";

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
	const { user, isAuthenticated } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Text>Loading...</Text>;
	}

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
