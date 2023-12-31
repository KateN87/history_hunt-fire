import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

//styles and components
import IconButton from "../components/IconButton";
import { GlobalColors, GlobalStyles } from "../styles/global";
import { getHumanReadableAddress } from "../util/location";
import useLocation from "../hooks/useLocation";

export const MapScreen = ({ navigation }) => {
	const [pickedLocations, setPickedLocations] = useState([]);
	const { initialRegion, isPending, hasLocatePermissions } = useLocation();

	const savepickedLocations = useCallback(async () => {
		if (!pickedLocations || pickedLocations.length === 0) {
			Alert.alert("No location selected", "You have to pick a location");
			return;
		}

		try {
			navigation.navigate("create", {
				locations: pickedLocations,
			});
		} catch (error) {
			console.error("Error fetching addresses:", error);
		}
	}, [navigation, pickedLocations]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					type="FontAwesome5"
					icon="save"
					size={38}
					color={tintColor}
					pressHandler={savepickedLocations}
				/>
			),
		});
	}, [navigation, savepickedLocations]);

	const pressHandler = async (e) => {
		const latitude = e.nativeEvent.coordinate.latitude;
		const longitude = e.nativeEvent.coordinate.longitude;

		const address = await getHumanReadableAddress({ latitude, longitude });
		const updatedLocation = { latitude, longitude, address };
		setPickedLocations((prev) => [...prev, updatedLocation]);
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
					minZoomLevel={15}
					initialRegion={initialRegion}
					onPress={pressHandler}
					showsUserLocation={true}
					followsUserLocation={true}
				>
					{pickedLocations.length > 0 &&
						pickedLocations.map((loc, index) => (
							<Marker
								key={index}
								coordinate={{
									latitude: loc.latitude,
									longitude: loc.longitude,
								}}
								pinColor={GlobalColors.hotPink}
							/>
						))}

					{pickedLocations.length > 0 && (
						<Polyline
							coordinates={pickedLocations.map((loc) => ({
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
			{pickedLocations.length > 0 && (
				<ScrollView>
					{pickedLocations.map((location, idx) => (
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
