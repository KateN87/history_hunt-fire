import { Text, View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
//comp & util
import CustomButton from "./CustomButton";
import { createLocationUrl } from "../util/location";
//Styles
import { GlobalStyles } from "../styles/global";

export const ShowLocComp = ({ pickedLocations }) => {
	const navigation = useNavigation();

	const pickOnMapHandler = () => {
		navigation.navigate("map");
	};

	return (
		<View style={styles.container}>
			<Text style={GlobalStyles.mediumTitle}>
				Where should the hunters go?
			</Text>
			<View style={styles.innerContainer}>
				{pickedLocations && (
					<Image
						source={{ uri: createLocationUrl(pickedLocations) }}
						style={styles.map}
					/>
				)}
				{!pickedLocations && (
					<Text style={GlobalStyles.smallTitle}>
						No picked locations yet
					</Text>
				)}
			</View>
			<View>
				<CustomButton
					title={pickedLocations ? "Change locations" : "Pick on map"}
					pressHandler={pickOnMapHandler}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		aligntItems: "center",
	},
	innerContainer: {
		width: "100%",
		height: 250,
		marginVertical: 10,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "red",
		borderBottom: 2,
	},
	map: {
		width: "100%",
		height: "100%",
	},
});
