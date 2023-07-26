import { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, Modal, Pressable } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { GlobalColors, GlobalStyles } from "../styles/global";
import CustomButton from "../components/CustomButton";
import { PhotoPicker } from "../components/PhotoPicker";
import IconButton from "../components/IconButton";
import { FontAwesome5 } from "@expo/vector-icons";

export default ProfileScreen = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [modalVisible, setModalVisible] = useState(false);

	const handleSubmit = () => {
		dispatch({ type: "LOGOUT" });
	};

	return (
		<View style={styles.container}>
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
				<Image source={user.image} style={styles.image} />
				<Text style={GlobalStyles.largeTitle}>{user}</Text>
			</View>
			<View>
				<Text style={[GlobalStyles.mediumTitle, styles.pinkText]}>
					Active Hunts
				</Text>
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
					<PhotoPicker />
				</View>
			</Modal>

			<CustomButton title="Log out" pressHandler={handleSubmit} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 80,
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
	pinkText: {
		color: GlobalColors.softPink,
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
});
