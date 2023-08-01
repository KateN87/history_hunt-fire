const GOOGLE_API_KEY = "AIzaSyBTP5sWCK8CsfgU-U-65RsewWr0lL1QqFs";

export const createLocationUrl = (locations) => {
	const markers = locations
		.map(({ latitude, longitude }, idx) => {
			const label = (idx + 1).toString();

			return `label:${label}|color:0xD01C71
			|size:mid|${latitude},${longitude}`;
		})
		.join("&markers=");

	const path = locations
		.map(({ latitude, longitude }) => `${latitude},${longitude}`)
		.join("|");

	return `https://maps.googleapis.com/maps/api/staticmap?center=${locations[0].latitude},${locations[0].longitude}&zoom=14&size=400x400&maptype=roadmap
      &markers=${markers}&path=color:0x570CBC|weight:5|${path}&key=${GOOGLE_API_KEY}`;
};
