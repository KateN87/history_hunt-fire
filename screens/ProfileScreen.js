import { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

//ctx & hooks
import { AuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";

//components
import CustomButton from "../components/CustomButton";
import { PhotoPicker } from "../components/PhotoPicker";
import IconButton from "../components/IconButton";
import { HuntsContainer } from "../components/HuntsContainer";
import { CustomModal } from "../components/CustomModal";

//styles
import { GlobalColors, GlobalStyles } from "../styles/global";

//firebase
import { updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";

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
				console.log("currentUser", auth.currentUser.uid);
				await updateProfile(auth.currentUser, {
					photoURL: imgUrl,
				});
				const docRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(docRef, {
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
			<CustomModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			>
				<PhotoPicker
					filename={user.uid}
					bucketname={"profilephotos"}
					setImgUrl={setImgUrl}
				/>
			</CustomModal>

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
