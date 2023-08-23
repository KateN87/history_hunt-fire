import { View, Text, StyleSheet, Image } from "react-native";
//hooks
import { useCollection } from "../hooks/useCollection";
//styles
import { GlobalStyles } from "../styles/global";
import { auth } from "../firebase/config";

export const AvatarList = ({ selectedFriends, imageStyle }) => {
	const user = auth.currentUser;

	const { documents: friendList } = useCollection("users", [
		"__name__",
		"in",
		selectedFriends,
	]);

	return (
		<View style={styles.friendsContainer}>
			{friendList &&
				friendList.map((friend) => {
					if (friend.id !== user.uid) {
						return (
							<View
								key={friend.id}
								style={styles.friendsInnerContainer}
							>
								<Image
									source={{ uri: friend.photoURL }}
									style={imageStyle}
								/>
								<Text style={GlobalStyles.smallTitle}>
									{friend.displayName}
								</Text>
							</View>
						);
					}
				})}
		</View>
	);
};

const styles = StyleSheet.create({
	friendsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	friendsInnerContainer: {
		marginHorizontal: 10,
		alignItems: "center",
	},
});
