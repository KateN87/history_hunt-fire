import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalColors } from "../styles/global";

export default CustomButton = ({ title, pressHandler, disabled }) => {
	return (
		<TouchableOpacity
			style={styles.buttonContainer}
			onPress={pressHandler}
			disabled={disabled}
		>
			<LinearGradient
				colors={[GlobalColors.hotPurple, GlobalColors.hotPink]}
				style={styles.gradient}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 1 }}
			>
				<Text style={styles.buttonText}>{title}</Text>
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 20,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 25,
		elevation: 2,
	},
	buttonText: {
		color: "white",
		fontFamily: "nunito-bold",
		fontSize: 24,
	},
	gradient: {
		flex: 1,
		width: 350,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
	},
});
