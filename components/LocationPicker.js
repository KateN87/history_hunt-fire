import { Text, View } from "react-native";
import * as Location from "expo-location";

import CustomButton from "./CustomButton";
import { useEffect, useState } from "react";
import { createLocationUrl } from "../util/location";
import { StyleSheet, Image } from "react-native";

export const LocationPicker = () => {
	const [hasLocatePermissions, setHasLocatePermissions] =
		Location.useForegroundPermissions();
	const [pickedLocation, setPickedLocation] = useState();

	//To check permissions
	useEffect(() => {
		(async () => {
			const locatePermission =
				await Location.requestForegroundPermissionsAsync();
			setHasLocatePermissions(locatePermission.status === "granted");
		})();
	}, []);

	const getLocationHandler = async () => {
		const location = await Location.getCurrentPositionAsync();
		setPickedLocation({
			lat: location.coords.latitude,
			lng: location.coords.longitude,
		});
		console.log("PICKED", pickedLocation);
	};

	const pickOnMapHandler = () => {};

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
			<View style={styles.innerContainer}>
				{pickedLocation && (
					<Image
						source={{ uri: createLocationUrl(pickedLocation) }}
						style={styles.map}
					/>
				)}
				{!pickedLocation && <Text>No picked lcoation yet</Text>}
			</View>
			<View>
				<CustomButton
					title="Locate user"
					pressHandler={getLocationHandler}
				/>
				<CustomButton
					title="Pick on map"
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
		marginVertical: 8,
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
