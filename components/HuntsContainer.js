import { Text, View, StyleSheet } from "react-native";
import { GlobalColors, GlobalStyles } from "../styles/global";

export const HuntsContainer = ({ title, documents }) => {
	return (
		<View>
			<Text style={[GlobalStyles.mediumTitle, styles.pinkText]}>
				{title}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	pinkText: {
		color: GlobalColors.softPink,
	},
});
