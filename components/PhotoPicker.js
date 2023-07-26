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
/* import * as ImagePicker from "expo-image-picker"; */

import { useContext, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { GlobalColors } from "../styles/global";
import { AuthContext } from "../context/AuthContext";
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export const PhotoPicker = ({ setImgUrl }) => {
	const { user } = useContext(AuthContext);
	const filename = user.uid;
	const storageRef = ref(storage, `profilephotos/${filename}`);

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

	/* 	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: false,
		});

		console.log(result);

		if (!result.canceled) {
			setPhoto(result.assets[0].uri);
		}
		if (result.canceled) {
			console.log("canceled");
		}
	}; */

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
				{/* <IconButton
					type={"Foundation"}
					icon="photo"
					color={GlobalColors.accentYellow}
					size={64}
					pressHandler={pickImage}
				/> */}
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
