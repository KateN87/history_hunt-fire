import { View, Text, StyleSheet, Image } from "react-native";
import { GlobalColors, GlobalStyles } from "../styles/global";
export const AvatarList = ({ avatarArray }) => {
	return (
		<View style={styles.friendsContainer}>
			{avatarArray.length > 0 &&
				avatarArray.map((friend) => (
					<View
						key={friend.userId}
						style={styles.friendsInnerContainer}
					>
						<Image
							source={{ uri: friend.photoURL }}
							style={styles.image}
						/>
						<Text style={GlobalStyles.smallTitle}>
							{friend.displayName}
						</Text>
					</View>
				))}
		</View>
	);
};

const styles = StyleSheet.create({
	friendsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	friendsInnerContainer: {
		justifyContent: "center",
		minWidth: 100,
		alignItems: "center",
	},
	image: {
		borderRadius: 100,
		width: 100,
		height: 100,
		borderWidth: 4,
		borderColor: GlobalColors.hotPink,
		margin: 10,
	},
});
