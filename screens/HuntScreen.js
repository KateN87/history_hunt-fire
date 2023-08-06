import { View, StyleSheet, ScrollView, Text, Image } from "react-native";

//styles
import { GlobalStyles } from "../styles/global";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { useEffect, useState } from "react";
import { ActiveHunting } from "../components/ActiveHunting";

export default LoginScreen = ({ navigation }) => {
	const route = useRoute();
	const hunt = route.params.hunt;
	const [startedHunt, setStartedHunt] = useState(false);

	useEffect(() => {
		if (startedHunt) {
			navigation.setOptions({
				headerShown: false,
			});
		} else {
			navigation.setOptions({
				headerShown: true,
			});
		}
	}, [startedHunt]);
	return (
		<View style={styles.container} key={hunt.id}>
			{!startedHunt && (
				<View style={styles.testContainer}>
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
							<View style={styles.itemContainer}>
								<Text style={GlobalStyles.smallTitle}>
									Starting address:
								</Text>
								<Text style={GlobalStyles.mediumTitle}>
									{hunt.pickedLocation[0].address}
								</Text>
							</View>
						</View>
						<View style={styles.itemContainer}>
							<CustomButton
								title="Start hunting!"
								pressHandler={() => setStartedHunt(true)}
							/>
						</View>
					</ScrollView>
				</View>
			)}
			{startedHunt && (
				<View style={styles.huntingContainer}>
					<ActiveHunting hunt={hunt} />
					<CustomButton
						title="Stop hunting!"
						pressHandler={() => setStartedHunt(false)}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		/* alignItems: "center", */
	},
	testContainer: {
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
