import { useContext } from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

//ctx
import { AuthContext } from "../context/AuthContext";

//Screens & components
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { MapScreen } from "../screens/MapScreen";
import { CreateScreen } from "../screens/CreateScreen";
import { FindFriendsScreen } from "../screens/FindFriendsScreen";
import LogoTitle from "../components/LogoTitle";

const Stack = createNativeStackNavigator();

export default StartNavigator = () => {
	const { user, isAuthenticated } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Text>Loading...</Text>;
	}

	return (
		<Stack.Navigator>
			{!user ? (
				<>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{
							headerTitle: (props) => <LogoTitle {...props} />,
							headerShadowVisible: false,
							headerTitleAlign: "center",
							headerTintColor: "purple",
						}}
					/>
					<Stack.Screen
						name="Signup"
						component={SignupScreen}
						options={{
							headerTitle: (props) => <LogoTitle {...props} />,
							headerShadowVisible: false,
							headerTitleAlign: "center",
							headerTintColor: "purple",
						}}
					/>
				</>
			) : (
				<>
					<Stack.Screen
						name="profile"
						component={ProfileScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="create"
						component={CreateScreen}
						options={({ navigation }) => ({
							headerShadowVisible: false,
							headerTitle: "",
							headerTintColor: "purple",
							headerLeft: () => (
								<View>
									<Ionicons
										name="arrow-back"
										size={48}
										color="purple"
										onPress={() => navigation.goBack()}
									/>
								</View>
							),
						})}
					/>
					<Stack.Screen
						name="map"
						component={MapScreen}
						options={({ navigation }) => ({
							headerShadowVisible: false,
							headerTitle: "Select places",
							headerTintColor: "purple",
							headerLeft: () => (
								<View>
									<Ionicons
										name="arrow-back"
										size={48}
										color="purple"
										onPress={() => navigation.goBack()}
									/>
								</View>
							),
						})}
					/>
					<Stack.Screen
						name="findfriends"
						component={FindFriendsScreen}
						options={({ navigation }) => ({
							headerShadowVisible: false,
							headerTitle: "Find Friends",
							headerTintColor: "purple",
							headerLeft: () => (
								<View>
									<Ionicons
										name="arrow-back"
										size={48}
										color="purple"
										onPress={() => navigation.goBack()}
									/>
								</View>
							),
						})}
					/>
				</>
			)}
		</Stack.Navigator>
	);
};
