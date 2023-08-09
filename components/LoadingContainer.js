import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { GlobalColors, GlobalStyles } from "../styles/global";

export const LoadingContainer = () => {
	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size="large" color={GlobalColors.hotPurple} />
			<Text style={GlobalStyles.mediumTitle}>Loading...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
