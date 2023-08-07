import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

//styles and components
import IconButton from "../components/IconButton";
import { GlobalColors, GlobalStyles } from "../styles/global";
import { getHumanReadableAddress } from "../util/location";
import usePermission from "../hooks/usePermission";
import useLocation from "../hooks/useLocation";

export const MapScreen = ({ navigation }) => {
	const [pickedLocation, setPickedLocation] = useState([]);
	const hasLocatePermissions = usePermission();
	const initialRegion = useLocation();

	const savePickedLocation = useCallback(async () => {
		if (!pickedLocation || pickedLocation.length === 0) {
			Alert.alert("No location selected", "You have to pick a location");
			return;
		}

		try {
			navigation.navigate("create", {
				locations: pickedLocation,
			});
		} catch (error) {
			console.error("Error fetching addresses:", error);
		}
	}, [navigation, pickedLocation]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					type="FontAwesome5"
					icon="save"
					size={38}
					color={tintColor}
					pressHandler={savePickedLocation}
				/>
			),
		});
	}, [navigation, savePickedLocation]);

	const pressHandler = async (e) => {
		const latitude = e.nativeEvent.coordinate.latitude;
		const longitude = e.nativeEvent.coordinate.longitude;

		const address = await getHumanReadableAddress({ latitude, longitude });
		const updatedLocation = { latitude, longitude, address };
		setPickedLocation((prev) => [...prev, updatedLocation]);
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
		<>
			{!initialRegion && (
				<View style={styles.container}>
					<Text>Loading...</Text>
				</View>
			)}
			{initialRegion && (
				<MapView
					style={styles.container}
					initialRegion={initialRegion}
					onPress={pressHandler}
					showsUserLocation={true}
					followsUserLocation={true}
				>
					{pickedLocation.length > 0 &&
						pickedLocation.map((loc, index) => (
							<Marker
								key={index}
								coordinate={{
									latitude: loc.latitude,
									longitude: loc.longitude,
								}}
								pinColor={GlobalColors.hotPink}
							/>
						))}

					{pickedLocation.length > 0 && (
						<Polyline
							coordinates={pickedLocation.map((loc) => ({
								latitude: loc.latitude,
								longitude: loc.longitude,
							}))}
							strokeColor={GlobalColors.hotPurple}
							strokeWidth={4}
						/>
					)}
				</MapView>
			)}
			<Text style={GlobalStyles.mediumTitle}>Selected addresses:</Text>
			{pickedLocation.length > 0 && (
				<ScrollView>
					{pickedLocation.map((location, idx) => (
						<View key={idx} style={styles.adressContainer}>
							<Text style={GlobalStyles.smallTitle}>
								{location.address}
							</Text>
						</View>
					))}
				</ScrollView>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		height: "50%",
	},
	adressContainer: {
		borderWidth: 1,
		borderColor: GlobalColors.lightGrey,
		margin: 8,
		padding: 8,
	},
});
