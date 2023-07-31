export const GlobalColors = {
	lightGrey: "#bebebe",
	mediumGrey: "#777676",
	darkGrey: "#2e2e2e",

	hotPink: "#D01C71",
	softPink: "rgba(184, 61, 195, 1)",
	softPurple: "rgba(101, 47, 157, 1)",
	hotPurple: "rgba(87, 12, 188, 1)",
	accentYellow: "rgb(235, 174, 52)",

	error100: "#f5e3ec",
	error200: "#a82564",
};

export const GlobalStyles = {
	largeTitle: {
		fontSize: 40,
		fontFamily: "nunito-bold",
		color: GlobalColors.softPurple,
	},
	mediumTitle: {
		fontSize: 22,
		fontFamily: "nunito-bold",
		color: GlobalColors.softPink,
	},
	smallTitle: {
		fontSize: 18,
		fontFamily: "nunito-bold",
		color: GlobalColors.softPurple,
	},
	errorContainer: {
		borderWidth: 2,
		borderRadius: 5,
		borderColor: GlobalColors.hotPink,
		backgroundColor: GlobalColors.error100,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginTop: 5,
	},
	errorText: {
		fontSize: 16,
		color: GlobalColors.error200,
	},
};
