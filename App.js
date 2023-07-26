import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { AuthContextProvider } from "./context/AuthContext";

import StartNavigator from "./navigators/StartNavigator";

//prevent splashscreen from hiding while fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [fontsLoaded] = useFonts({
		"nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
		"nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
	});
	//when fonts are loading we hide the splashscreen and display app screen
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	//splashscreen will continune to show
	if (!fontsLoaded) {
		return null;
	}

	return (
		<AuthContextProvider>
			<NavigationContainer onReady={onLayoutRootView}>
				<StartNavigator />
			</NavigationContainer>
			<StatusBar style="auto" />
		</AuthContextProvider>
	);
}
