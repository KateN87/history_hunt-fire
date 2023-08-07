import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

//styles and components
import IconButton from "../components/IconButton";
import { GlobalColors, GlobalStyles } from "../styles/global";
import { getRoute } from "../util/location";
import useLocation from "../hooks/useLocation";
import usePermission from "../hooks/usePermission";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "./CustomButton";

export const ActiveHunting = ({ hunt, setStartedHunt, startedHunt }) => {
	const hasLocatePermissions = usePermission();
	const [coords, setCoords] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const initialRegion = useLocation();
	const [nextPlace, setNextPlace] = useState(null);
	let locationSubscription = null;

	useEffect(() => {
		if (startedHunt && hasLocatePermissions) {
			startWatching(); // Start watching user's position
		}
		//cleanup
		return () => {
			if (locationSubscription) {
				locationSubscription.remove();
			}
		};
	}, [hasLocatePermissions, startedHunt]);

	const startWatching = async () => {
		locationSubscription = await Location.watchPositionAsync(
			{
				accuracy: Location.Accuracy.High,
				timeInterval: 1000, // milliseconds
				distanceInterval: 10, // meters
				mayShowUserSettingsDialog: true, // Prompt the user for background location permission
			},
			(location) => {
				// Handle the updated location data here
				console.log("New location:", location);
			}
		);

		// To stop watching the location, you can call locationSubscription.remove();
	};

	const pressHandler = async (loc) => {
		setIsLoading(true);
		try {
			const location = await Location.getCurrentPositionAsync();
			const startLoc = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			};

			const destinationLoc = {
				latitude: loc.latitude,
				longitude: loc.longitude,
			};

			const getCoords = await getRoute(startLoc, destinationLoc);
			setCoords(getCoords);
			setNextPlace(loc.address);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching route:", error);
			setIsLoading(false);
		}
	};

	const stopHandler = () => {
		console.log("LOCATION", locationSubscription);
		if (locationSubscription) {
			locationSubscription.remove();
		}
		setStartedHunt(false);
	};

	if (hasLocatePermissions === undefined) {
		return <Text>Requesting permissions...</Text>;
	} else if (!hasLocatePermissions) {
		return (
			<Text>
				Permission for GPS location not granted. Please change this in
				settings.
			</Text>
		);
	}

	return (
		<View>
			{isLoading && (
				<View style={styles.loadingContainer}>
					<Text>Loading...</Text>
				</View>
			)}
			<LinearGradient
				colors={[GlobalColors.hotPurple, GlobalColors.hotPink]}
				style={styles.topContainer}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 1 }}
			>
				<Text style={[GlobalStyles.largeTitle, styles.yellowText]}>
					Next Stop:
				</Text>
				{nextPlace ? (
					<Text style={[GlobalStyles.smallTitle, styles.whiteText]}>
						{nextPlace}
					</Text>
				) : (
					<Text style={[GlobalStyles.smallTitle, styles.whiteText]}>
						Pick one of the locations on your map!
					</Text>
				)}
			</LinearGradient>

			{initialRegion && (
				<MapView
					style={styles.mapContainer}
					initialRegion={initialRegion}
					showsUserLocation={true}
					followsUserLocation={true}
				>
					{hunt.pickedLocation.map((loc, index) => (
						<Marker
							key={index}
							coordinate={{
								latitude: loc.latitude,
								longitude: loc.longitude,
							}}
							pinColor={GlobalColors.hotPink}
							onPress={() => pressHandler(loc)}
						/>
					))}
					{coords && (
						<Polyline
							coordinates={coords}
							strokeColor={GlobalColors.hotPurple}
							strokeWidth={4}
						/>
					)}
				</MapView>
			)}
			<View style={styles.buttonContainer}>
				<CustomButton
					title="Stop hunting!"
					pressHandler={stopHandler}
					style={styles.button}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mapContainer: {
		height: "70%",
		marginBottom: 25,
	},
	topContainer: {
		flex: 1,
		marginTop: 50,
		minHeight: 130,
		maxHeight: 150,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.7)",
	},
	yellowText: {
		color: GlobalColors.accentYellow,
	},
	whiteText: {
		color: "#fff",
	},
	buttonContainer: {
		marginHorizontal: 28,
	},
});
