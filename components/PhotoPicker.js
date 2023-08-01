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
import { useEffect, useRef, useState } from "react";
//firebase
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
//styles
import { GlobalColors } from "../styles/global";
//Components
import IconButton from "./IconButton";

export const PhotoPicker = ({ setImgUrl, bucketname, filename }) => {
	const storageRef = ref(storage, `${bucketname}/${filename}`);

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
			base64: true,
			exif: false,
		};

		let newPhoto = await cameraRef.current.takePictureAsync(options);
		setPhoto(newPhoto);
	};

	if (photo) {
		let savePhoto = async () => {
			await MediaLibrary.saveToLibraryAsync(photo.uri);

			// Convert the file URI to base64
			const response = await fetch(photo.uri);
			const blob = await response.blob();

			// Upload the image Blob to Firebase Storage
			const uploadTask = uploadBytes(storageRef, blob);

			// Wait for the upload to complete
			await uploadTask;

			// Get the download URL of the uploaded image
			const image = await getDownloadURL(storageRef);

			setImgUrl(image);

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
