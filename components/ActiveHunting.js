import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";

//styles and components
import IconButton from "../components/IconButton";
import { GlobalColors, GlobalStyles } from "../styles/global";
import { getRoute } from "../util/location";
import useLocation from "../hooks/useLocation";
import usePermission from "../hooks/usePermission";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "./CustomButton";
import { LoadingContainer } from "./LoadingContainer";

export const ActiveHunting = ({ hunt, setStartedHunt }) => {
	const hasLocatePermissions = usePermission();
	const [coords, setCoords] = useState();
	const { initialRegion, isPending } = useLocation();
	const [nextPlace, setNextPlace] = useState(null);
	const [isFound, setIsFound] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	let locationSubscription = null;

	const startWatching = async () => {
		if (locationSubscription) {
			locationSubscription.remove();
		}
		locationSubscription = await Location.watchPositionAsync(
			{
				accuracy: Location.Accuracy.BestForNavigation,
				timeInterval: 1000, // milliseconds
				distanceInterval: 10, // meters
				mayShowUserSettingsDialog: true,
			},
			async (location) => {
				const { latitude: currentLat, longitude: currentLong } =
					location.coords;
				const { latitude: destLat, longitude: destLong } =
					nextPlace.destinationLoc;

				const distance = getDistance(
					{
						latitude: currentLat,
						longitude: currentLong,
					},
					{
						latitude: destLat,
						longitude: destLong,
					}
				);
				if (distance <= 20) {
					setIsFound(true);
					locationSubscription.remove();
				}
			}
		);
	};

	useEffect(() => {
		if (nextPlace) {
			startWatching();
		}
		return () => {
			if (locationSubscription) {
				locationSubscription.remove();
			}
		};
	}, [nextPlace]);

	const pressHandler = async (loc) => {
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
			setNextPlace({ address: loc.address, destinationLoc });
		} catch (error) {
			console.error("Error fetching route:", error);
		}
	};

	const stopHandler = () => {
		if (locationSubscription) {
			locationSubscription.remove();
		}
		setNextPlace(null);
		setStartedHunt(false);
	};

	const foundHandler = () => {
		if (!isFound) {
			return Alert.alert(
				"Not there yet!",
				"Keep looking for the place on the map"
			);
		}
		setModalVisible(true);
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
						{nextPlace.address}
					</Text>
				) : (
					<Text style={[GlobalStyles.smallTitle, styles.whiteText]}>
						Pick one of the locations on your map!
					</Text>
				)}
			</LinearGradient>
			{isPending && <LoadingContainer />}
			{/* {isLoading && <LoadingContainer />} */}
			{!isPending /* && !isLoading */ && (
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
				<IconButton
					type={"MaterialCommunityIcons"}
					icon={isFound ? "camera" : "camera-off"}
					color={GlobalColors.accentYellow}
					size={40}
					pressHandler={foundHandler}
				/>
				<IconButton
					type={"MaterialCommunityIcons"}
					icon="cancel"
					color={GlobalColors.accentYellow}
					size={40}
					pressHandler={stopHandler}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mapContainer: {
		height: "60%",
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
	yellowText: {
		color: GlobalColors.accentYellow,
	},
	whiteText: {
		color: "#fff",
	},
	buttonContainer: {
		justifyContent: "center",
		flexDirection: "row",
	},
});
