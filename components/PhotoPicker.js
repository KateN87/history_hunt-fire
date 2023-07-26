import {
	View,
	Button,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import { useContext, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { GlobalColors } from "../styles/global";
import { updatePhotoURL } from "../util/https";
import { AuthContext } from "../context/AuthContext";

export const PhotoPicker = () => {
	const { token } = useContext(AuthContext);
	const cameraRef = useRef();
	const [type, setType] = useState(CameraType.back);
	const [hasCameraPermissions, setHasCameraPermissions] = useState();
	const [hasMediaLibraryPermissions, setHasMediaLibraryPermissions] =
		useState();
	const [photo, setPhoto] = useState();

	//To check permissions
	useEffect(() => {
		(async () => {
			const cameraPermission =
				await Camera.requestCameraPermissionsAsync();
			const mediaLibraryPermission =
				await MediaLibrary.requestPermissionsAsync();
			setHasCameraPermissions(cameraPermission.status === "granted");
			setHasMediaLibraryPermissions(
				mediaLibraryPermission.status === "granted"
			);
		})();
	}, []);

	const toggleCameraType = () => {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	};

	const takePic = async () => {
		let options = {
			quality: 1,
			/* 			base64: true, */
			exif: false,
		};

		let newPhoto = await cameraRef.current.takePictureAsync(options);
		setPhoto(newPhoto);
	};

	if (photo) {
		let savePhoto = async () => {
			await MediaLibrary.saveToLibraryAsync(photo.uri);
			const newPhoto = await updatePhotoURL(token, photo.uri);
			console.log(newPhoto);
			setPhoto(undefined);
		};

		return (
			<SafeAreaView style={styles.container}>
				<Image style={styles.preview} source={{ uri: photo.uri }} />
				{hasMediaLibraryPermissions ? (
					<Button title="Save" onPress={savePhoto} />
				) : undefined}
				<Button title="Discard" onPress={() => setPhoto(undefined)} />
			</SafeAreaView>
		);
	}

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	if (hasCameraPermissions === undefined) {
		return <Text>Requesting permissions...</Text>;
	} else if (!hasCameraPermissions) {
		return (
			<Text>
				Permission for camera not granted. Please change this in
				settings.
			</Text>
		);
	}

	return (
		<Camera style={styles.container} ref={cameraRef} type={type}>
			<View style={styles.buttonContainer}>
				<IconButton
					type={"FontAwesome5"}
					icon="camera"
					color={GlobalColors.accentYellow}
					size={64}
					pressHandler={takePic}
				/>
				<IconButton
					type={"MaterialCommunityIcons"}
					icon="camera-flip"
					color={GlobalColors.accentYellow}
					size={64}
					pressHandler={toggleCameraType}
				/>
				<IconButton
					type={"Foundation"}
					icon="photo"
					color={GlobalColors.accentYellow}
					size={64}
					pressHandler={pickImage}
				/>
			</View>
		</Camera>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		aligntItems: "center",
		justifyContent: "flex-end",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	preview: {
		alignSelf: "stretch",
		flex: 1,
	},
});
