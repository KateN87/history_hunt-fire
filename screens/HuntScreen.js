import { View, StyleSheet, ScrollView, Text, Image } from "react-native";

//styles
import { GlobalStyles, GlobalColors } from "../styles/global";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { LocationPicker } from "../components/LocationPicker";
import CustomButton from "../components/CustomButton";

export default LoginScreen = () => {
	const route = useRoute();
	const hunt = route.params.hunt;

	return (
		<View style={styles.container}>
			<Text style={GlobalStyles.largeTitle}>Start hunting!</Text>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.innerContainer}>
					<View style={styles.itemContainer}>
						<Text style={GlobalStyles.smallTitle}>
							You picked:{" "}
						</Text>
						<Text style={GlobalStyles.mediumTitle}>
							{hunt.title}
						</Text>
					</View>
					<View style={styles.itemContainer}>
						<Text style={GlobalStyles.smallTitle}>
							Here is the route you will be taking:{" "}
						</Text>
						<Image
							source={{ uri: hunt.photoURL }}
							style={styles.map}
						/>
					</View>
					<View style={styles.itemContainer}>
						<Text style={GlobalStyles.smallTitle}>
							This should take approximately:
						</Text>
						<Text style={GlobalStyles.mediumTitle}>
							{hunt.time}
						</Text>
					</View>
				</View>
				<View style={styles.itemContainer}>
					<CustomButton title="Start hunting!" />
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
	},
	innerContainer: {
		flex: 1,
		alignItems: "center",
	},
	itemContainer: {
		alignItems: "center",
		marginVertical: 15,
	},
	map: {
		width: 400,
		height: 200,
	},
});
