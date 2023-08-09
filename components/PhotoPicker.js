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

export const PhotoPicker = ({
	setImgUrl,
	bucketname,
	filename,
	dontSave,
	setFinishedLocations,
	setModalVisible,
}) => {
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

	let savePhoto = async () => {
		await MediaLibrary.saveToLibraryAsync(photo.uri);

		if (!dontSave) {
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
		} else {
			setFinishedLocations((prev) => prev + 1);
		}
		setPhoto(undefined);
		setModalVisible(false);
	};

	if (photo) {
		return (
			<View style={styles.previewContainer}>
				<Image style={styles.preview} source={{ uri: photo.uri }} />
				<View style={styles.buttonContainer}>
					{hasMediaLibraryPermissions ? (
						<IconButton
							type={"MaterialCommunityIcons"}
							icon="content-save-check-outline"
							color={GlobalColors.accentYellow}
							size={82}
							pressHandler={savePhoto}
						/>
					) : undefined}
					<IconButton
						type={"MaterialCommunityIcons"}
						icon="trash-can-outline"
						color={GlobalColors.accentYellow}
						size={82}
						pressHandler={() => setPhoto(undefined)}
					/>
				</View>
			</View>
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
					type={"MaterialCommunityIcons"}
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
		alignItems: "center",
		justifyContent: "flex-end",
	},
	previewContainer: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	buttonContainer: {
		flexDirection: "row",
	},
	preview: {
		borderRadius: 300,
		width: 300,
		height: 300,
		borderWidth: 4,
		borderColor: GlobalColors.hotPink,
	},
});
