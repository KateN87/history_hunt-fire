import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//hooks and components
import IconButton from "../components/IconButton";
import { getRoute } from "../util/location";
import useLocation from "../hooks/useLocation";
import usePermission from "../hooks/usePermission";
import { LoadingContainer } from "./LoadingContainer";
import { CustomModal } from "./CustomModal";
import { PhotoPicker } from "./PhotoPicker";
//Styles
import { GlobalColors, GlobalStyles } from "../styles/global";
import { auth, db } from "../firebase/config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export const ActiveHunting = ({ hunt, setStartedHunt }) => {
	console.log("HUNT", hunt);
	const hasLocatePermissions = usePermission();
	const finishedLocations = hunt.pickedLocations.filter(
		(place) => place.finished
	).length;
	const [coords, setCoords] = useState();
	const { initialRegion, isPending } = useLocation();
	const [nextPlace, setNextPlace] = useState(null);
	const [isFound, setIsFound] = useState(true); //CHANGE TO FALSE IF CHECKING FOR LOCATION
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
				if (distance <= 10) {
					setIsFound(true);
					locationSubscription.remove();
				}
			}
		);
	};

	const updateHuntDB = async () => {
		// Create an initial document to update.
		const docRef = doc(db, "hunts", hunt.id);
		await updateDoc(docRef, {
			finishedHunters: arrayUnion(auth.currentUser.uid),
		});
		return;
	};

	const updateFinishedLoc = (index) => {
		const updatedLocation = [...hunt.pickedLocations];
		updatedLocation[index].finished = true;
	};

	useEffect(() => {
		if (nextPlace) {
			startWatching();
		}
		//check if all locations are found
		const allLocationsFound = hunt.pickedLocations.every(
			(place) => place.finished
		);

		if (allLocationsFound) {
			updateHuntDB();
			Alert.alert("Finished!", "You've found all the locations!", [
				{ text: "YAY!", onPress: () => stopHandler() },
			]);
		}

		return () => {
			if (locationSubscription) {
				locationSubscription.remove();
			}
		};
	}, [nextPlace, hunt.pickedLocations, updateFinishedLoc]);

	const pressHandler = async (place, index) => {
		try {
			const location = await Location.getCurrentPositionAsync();

			const startLoc = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			};

			const destinationLoc = {
				latitude: place.latitude,
				longitude: place.longitude,
			};

			const getCoords = await getRoute(startLoc, destinationLoc);
			setCoords(getCoords);
			setNextPlace({ address: place.address, destinationLoc, index });
		} catch (error) {
			console.error("Error fetching route:", error);
		}
	};

	const stopHandler = () => {
		if (locationSubscription) {
			locationSubscription.remove();
		}
		/* setNextPlace(null); */
		setStartedHunt(false);
	};

	const foundHandler = () => {
		if (!isFound) {
			//ONLY WORKING IF USING GPS location IRL
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
				<Text style={[GlobalStyles.smallTitle, styles.whiteText]}>
					{finishedLocations} / {hunt.pickedLocations.length}
				</Text>
			</LinearGradient>
			{isPending && <LoadingContainer />}
			{!isPending && (
				<MapView
					style={styles.mapContainer}
					minZoomLevel={15}
					initialRegion={initialRegion}
					showsUserLocation={true}
					followsUserLocation={true}
				>
					{hunt.pickedLocations.map((place, index) => (
						<Marker
							key={index}
							coordinate={{
								latitude: place.latitude,
								longitude: place.longitude,
							}}
							/* pinColor={GlobalColors.hotPink} */
							onPress={() => pressHandler(place, index)}
						>
							{place.finished && (
								<MaterialCommunityIcons
									name="map-marker-check"
									size={42}
									color={GlobalColors.hotPink}
								/>
							)}
							{!place.finished && (
								<MaterialCommunityIcons
									name="map-marker"
									size={42}
									color={GlobalColors.hotPink}
								/>
							)}
						</Marker>
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
					size={72}
					pressHandler={foundHandler}
				/>
				<IconButton
					type={"MaterialCommunityIcons"}
					icon="cancel"
					color={GlobalColors.accentYellow}
					size={72}
					pressHandler={stopHandler}
				/>
			</View>
			{nextPlace && (
				<CustomModal
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				>
					<PhotoPicker
						dontSave={true}
						setModalVisible={setModalVisible}
						updateFinishedLoc={() =>
							updateFinishedLoc(nextPlace.index)
						}
					/>
				</CustomModal>
			)}
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
		minHeight: 150,
		maxHeight: 150,
		justifyContent: "center",
		alignItems: "center",
	},
	yellowText: {
		color: GlobalColors.accentYellow,
	},
	whiteText: {
		color: "#fff",
		padding: 5,
	},
	buttonContainer: {
		justifyContent: "center",
		flexDirection: "row",
	},
});
