import { Text, View, StyleSheet, Image, Pressable } from "react-native";
//Styles
import { GlobalColors, GlobalStyles } from "../styles/global";
import { AvatarList } from "./AvatarList";
import { useCollection } from "../hooks/useCollection";

export const HuntsContainer = ({
	title,
	queryArray,
	ownHunts,
	pressHandler,
	showExtra,
}) => {
	const { documents: huntsDocs } = useCollection(
		"hunts",
		queryArray,
		ownHunts
	);

	if (!huntsDocs) {
		return <Text>Loading...</Text>;
	}
	return (
		<View style={styles.mainContainer}>
			<Text style={[GlobalStyles.mediumTitle, styles.pinkText]}>
				{title}:
			</Text>
			<View style={showExtra ? "" : styles.row}>
				{huntsDocs.length > 0 &&
					huntsDocs.map((hunt) => (
						<Pressable
							onPress={() => pressHandler("hunt", { hunt })}
							key={hunt.id}
						>
							{!showExtra && (
								<View style={styles.column}>
									<View style={styles.titleImageContainer}>
										<Image
											source={{ uri: hunt.photoURL }}
											style={styles.huntImage}
										/>
									</View>
								</View>
							)}
							{showExtra && (
								<View style={styles.huntContainer}>
									<View style={styles.titleImageContainer}>
										<Image
											source={{ uri: hunt.photoURL }}
											style={styles.huntImage}
										/>
										<Text
											style={[
												GlobalStyles.mediumTitle,
												styles.greyText,
											]}
										>
											{hunt.title}
										</Text>
									</View>

									<View style={styles.friendContainer}>
										{hunt.selectedFriends.length != 0 && (
											<>
												<Text
													style={[
														GlobalStyles.smallTitle,
														styles.withText,
													]}
												>
													With:
												</Text>
												<AvatarList
													selectedFriends={
														hunt.selectedFriends
													}
													imageStyle={
														styles.avatarImage
													}
												/>
											</>
										)}
										{hunt.selectedFriends.length === 0 && (
											<Text
												style={[
													GlobalStyles.smallTitle,
													styles.withText,
												]}
											>
												Soloing it!
											</Text>
										)}
									</View>
								</View>
							)}
						</Pressable>
					))}
				{!huntsDocs ||
					(huntsDocs.length === 0 && (
						<Text
							style={[GlobalStyles.smallTitle, styles.withText]}
						>
							{" "}
							You have no hunts here yet
						</Text>
					))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	pinkText: {
		color: GlobalColors.softPink,
	},
	greyText: {
		color: GlobalColors.darkGrey,
	},
	mainContainer: {
		marginVertical: 15,
	},
	row: {
		flexDirection: "row",
	},
	huntContainer: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: GlobalColors.lightGrey,
		marginVertical: 5,
	},
	titleImageContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	friendContainer: {
		alignItems: "flex-start",
		margin: 10,
	},
	huntImage: {
		borderRadius: 100,
		width: 60,
		height: 60,
		borderWidth: 3,
		borderColor: GlobalColors.hotPink,
		margin: 10,
	},
	avatarImage: {
		borderRadius: 100,
		width: 40,
		height: 40,
		borderWidth: 2,
		borderColor: GlobalColors.hotPink,
		marginVertical: 10,
	},
});
