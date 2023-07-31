import { useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";

import CustomButton from "./CustomButton";
import { createLocationUrl } from "../util/location";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../styles/global";

export const LocationPicker = ({ pickedLocation, setPickedLocation }) => {
	const [hasLocatePermissions, setHasLocatePermissions] =
		Location.useForegroundPermissions();

	const navigation = useNavigation();

	//To check permissions
	useEffect(() => {
		(async () => {
			const locatePermission =
				await Location.requestForegroundPermissionsAsync();
			setHasLocatePermissions(locatePermission.status === "granted");
		})();
	}, []);

	const pickOnMapHandler = () => {
		navigation.navigate("map");
	};

	if (hasLocatePermissions === undefined) {
		return <Text>Requesting permissions...</Text>;
	} else if (!hasLocatePermissions) {
		return (
			<Text>
				Permission for gps location not granted. Please change this in
				settings.
			</Text>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={GlobalStyles.mediumTitle}>
				Where should the hunters go?
			</Text>
			<View style={styles.innerContainer}>
				{pickedLocation && (
					<Image
						source={{ uri: createLocationUrl(pickedLocation) }}
						style={styles.map}
					/>
				)}
				{!pickedLocation && <Text>No picked location yet</Text>}
			</View>
			<View>
				<CustomButton
					title={pickedLocation ? "Change locations" : "Pick on map"}
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
