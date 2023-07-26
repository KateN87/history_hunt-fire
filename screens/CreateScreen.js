import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../styles/global";

export const CreateScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={GlobalStyles.largeTitle}>CREATE SOMETHING</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
});
