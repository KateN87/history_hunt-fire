import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { auth } from "../firebase/config";
import { GlobalColors, GlobalStyles } from "../styles/global";
import { StyleSheet } from "react-native";
import { AvatarList } from "./AvatarList";

export const ShowInvitedCreated = ({ hunt }) => {
	const [updatedFriendList, setUpdatedFriendList] = useState();

	useEffect(() => {
		if (hunt.createdBy !== auth.currentUser.uid) {
			setUpdatedFriendList([...hunt.selectedFriends, hunt.createdBy]);
		} else {
			setUpdatedFriendList([...hunt.selectedFriends]);
		}
	}, [hunt]);

	if (!updatedFriendList) {
		return <Text>Loading...</Text>;
	}

	return (
		<View>
			<>
				<AvatarList
					selectedFriends={updatedFriendList}
					imageStyle={styles.avatarImage}
				/>
			</>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarImage: {
		borderRadius: 100,
		width: 40,
		height: 40,
		borderWidth: 2,
		borderColor: GlobalColors.hotPink,
		marginVertical: 10,
	},
});
