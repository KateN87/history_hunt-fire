import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import IconButton from "../components/IconButton";
import * as Location from "expo-location";
import { GlobalColors } from "../styles/global";

export const MapScreen = ({ navigation }) => {
	const [pickedLocation, setPickedLocation] = useState([]);
	const [initialRegion, setInitialRegion] = useState();

	useEffect(() => {
		const getLocation = async () => {
			const location = await Location.getCurrentPositionAsync();
			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		};
		getLocation();
	}, []);

	const savePickedLocation = useCallback(() => {
		if (!pickedLocation) {
			Alert.alert("No location selected", "You have to pick a location");
			return;
		}
		navigation.navigate("locate", pickedLocation);
	}, [navigation, pickedLocation]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<IconButton
					type="FontAwesome5"
					icon="save"
					size={24}
					color={tintColor}
					pressHandler={savePickedLocation}
				/>
			),
		});
	}, [navigation, savePickedLocation]);

	const pressHandler = (e) => {
		const latitude = e.nativeEvent.coordinate.latitude;
		const longitude = e.nativeEvent.coordinate.longitude;
		setPickedLocation((prev) => [...prev, { latitude, longitude }]);
	};

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

					{pickedLocation.length > 1 && (
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
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
