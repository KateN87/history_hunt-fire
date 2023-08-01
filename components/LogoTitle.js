import { View, Text, StyleSheet, Image } from "react-native";
//Styles
import { GlobalColors, GlobalStyles } from "../styles/global";

export default LogoTitle = () => {
	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/compass.png")}
				style={styles.image}
			/>
			<View style={styles.textContainer}>
				<Text style={[GlobalStyles.largeTitle, styles.boldTitle]}>
					History
				</Text>
				<Text style={[GlobalStyles.largeTitle, styles.regularTitle]}>
					Hunt
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	image: {
		width: 80,
		height: 80,
	},
	textContainer: {
		flexDirection: "row",
	},
	boldTitle: {
		color: GlobalColors.hotPurple,
	},
	regularTitle: {
		fontFamily: "nunito-regular",
		color: GlobalColors.hotPink,
	},
});
