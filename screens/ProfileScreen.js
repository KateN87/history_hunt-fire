import { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable,
	ScrollView,
} from "react-native";
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
import { doc, updateDoc } from "firebase/firestore";

export default ProfileScreen = ({ navigation }) => {
	const { user } = useContext(AuthContext);
	const { logout } = useLogout();
	const [modalVisible, setModalVisible] = useState(false);
	const [imgUrl, setImgUrl] = useState();

	const navigateHandler = (screen, props) => {
		navigation.navigate(screen, props);
	};

	useEffect(() => {
		if (imgUrl) {
			const updateImage = async () => {
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
			<CustomModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			>
				<PhotoPicker
					filename={user.uid}
					bucketname={"profilephotos"}
					setImgUrl={setImgUrl}
					setModalVisible={setModalVisible}
				/>
			</CustomModal>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					<HuntsContainer
						title="Invited Hunts"
						queryArray={[
							"selectedFriends",
							"==",
							auth.currentUser.uid,
						]}
						pressHandler={navigateHandler}
					/>
				</View>
				<View>
					<HuntsContainer
						title="My Hunts"
						queryArray={["createdBy", "==", auth.currentUser.uid]}
						pressHandler={navigateHandler}
					/>
				</View>
				<View style={styles.innerContainer}>
					<CustomButton
						title="Create Hunt"
						pressHandler={() => navigateHandler("create")}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 40,
		paddingHorizontal: 20,
		backgroundColor: "white",
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
		right: 100,
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
		alignItems: "center",
	},
});
