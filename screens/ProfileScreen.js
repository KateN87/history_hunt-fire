import { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Modal, Pressable } from "react-native";

//ctx & hooks
import { AuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

//components
import CustomButton from "../components/CustomButton";
import { PhotoPicker } from "../components/PhotoPicker";
import IconButton from "../components/IconButton";
import { HuntsContainer } from "../components/HuntsContainer";

//styles
import { GlobalColors, GlobalStyles } from "../styles/global";

//firebase
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";

export default ProfileScreen = () => {
	const { user } = useContext(AuthContext);
	const { logout } = useLogout();
	const [modalVisible, setModalVisible] = useState(false);
	const [imgUrl, setImgUrl] = useState();
	const navigation = useNavigation();

	const navigateHandler = () => {
		navigation.navigate("create");
	};

	useEffect(() => {
		if (imgUrl) {
			const updateImage = async () => {
				await updateProfile(auth.currentUser, {
					photoURL: imgUrl,
				});
			};
			updateImage();
		}
	});

	return (
		<View style={styles.container}>
			<Pressable onPress={logout} style={styles.logoutBtn}>
				<Text style={[GlobalStyles.mediumTitle, styles.logoutBtnText]}>
					Log out
				</Text>
			</Pressable>

			<View style={styles.imageNameContainer}>
				<View style={styles.editBtn}>
					<IconButton
						type="FontAwesome5"
						icon="user-edit"
						size={32}
						color={GlobalColors.accentYellow}
						pressHandler={() => setModalVisible(true)}
					/>
				</View>

				<Image source={{ uri: user.photoURL }} style={styles.image} />
				<Text style={GlobalStyles.largeTitle}>{user.displayName}</Text>
			</View>
			<View>
				<HuntsContainer title="Active Hunts" />
			</View>
			<View>
				<HuntsContainer title="Planned Hunts" />
			</View>
			<Modal
				animationType="slide"
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalView}>
					<Pressable
						style={[styles.button, styles.buttonClose]}
						onPress={() => setModalVisible(!modalVisible)}
					>
						<Text style={styles.closeText}>X</Text>
					</Pressable>
					<PhotoPicker setImgUrl={setImgUrl} />
				</View>
			</Modal>
			<View style={styles.innerContainer}>
				<CustomButton
					title="Create Hunt"
					pressHandler={navigateHandler}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 60,
	},
	imageNameContainer: {
		alignItems: "center",
	},
	image: {
		borderRadius: 100,
		width: 150,
		height: 150,
		borderWidth: 4,
		borderColor: GlobalColors.hotPink,
	},
	editBtn: {
		position: "absolute",
		top: 90,
		right: 125,
		zIndex: 5,
	},
	closeText: {
		fontSize: 32,
		fontWeight: "bold",
		marginLeft: 10,
		color: GlobalColors.accentYellow,
	},
	modalView: {
		flex: 1,
	},
	logoutBtn: {
		alignSelf: "flex-end",
		marginRight: 10,
	},
	logoutBtnText: {
		color: GlobalColors.accentYellow,
	},
	innerContainer: {
		marginTop: 50,
		alignItems: "center",
	},
});
