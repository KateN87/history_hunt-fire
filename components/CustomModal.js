import { Modal, Text, View, StyleSheet, Pressable } from "react-native";
//Styles
import { GlobalColors } from "../styles/global";

const CustomModal = ({ children, modalVisible, setModalVisible }) => {
	return (
		<Modal
			animationType="slide"
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
		>
			<View style={styles.modalView}>
				<Pressable onPress={() => setModalVisible(!modalVisible)}>
					<Text style={styles.closeText}>X</Text>
				</Pressable>
				{children}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
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

export { CustomModal };
