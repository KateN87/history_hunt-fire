const GOOGLE_API_KEY = "AIzaSyBTP5sWCK8CsfgU-U-65RsewWr0lL1QqFs";

export const createLocationUrl = (locations) => {
	const markers = locations
		.map(({ latitude, longitude }) => {
			return `color:0xD01C71
			|size:small|${latitude},${longitude}`;
		})
		.join("&markers=");

	const path = locations
		.map(({ latitude, longitude }) => `${latitude},${longitude}`)
		.join("|");

	return `https://maps.googleapis.com/maps/api/staticmap?center=${locations[0].latitude},${locations[0].longitude}&zoom=11&size=500x200&maptype=roadmap
      &markers=${markers}&path=color:0x570CBC|weight:5|${path}&key=${GOOGLE_API_KEY}`;
};
