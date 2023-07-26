import {
	FontAwesome5,
	MaterialCommunityIcons,
	Foundation,
} from "@expo/vector-icons";

import { Pressable, StyleSheet } from "react-native";

const IconButton = ({ type, icon, size, color, pressHandler }) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.container,
				pressed && styles.pressed,
			]}
			onPress={pressHandler}
		>
			{type === "FontAwesome5" && (
				<FontAwesome5
					name={icon}
					size={size}
					color={color}
					pressHandler={pressHandler}
				/>
			)}
			{type === "MaterialCommunityIcons" && (
				<MaterialCommunityIcons
					name={icon}
					size={size}
					color={color}
					pressHandler={pressHandler}
				/>
			)}
			{type === "Foundation" && (
				<Foundation
					name={icon}
					size={size}
					color={color}
					pressHandler={pressHandler}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	pressed: {
		opacity: 0.7,
	},
});

export default IconButton;
