import axios from "axios";
import Polyline from "@mapbox/polyline";
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

export const getHumanReadableAddress = async ({ latitude, longitude }) => {
	const resp = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
	);

	if (!resp.ok) {
		throw new Error("Could not fetch address");
	}
	const data = await resp.json();
	return data.results[0].formatted_address;
};

export const getRoute = async (startLoc, destinationLoc) => {
	try {
		const resp = await axios.get(
			"https://maps.googleapis.com/maps/api/directions/json",
			{
				params: {
					origin: `${startLoc.latitude},${startLoc.longitude}`,
					destination: `${destinationLoc.latitude},${destinationLoc.longitude}`,
					travelMode: "DRIVING",
					key: GOOGLE_API_KEY,
				},
			}
		);
		let points = Polyline.decode(
			resp.data.routes[0].overview_polyline.points
		);
		let coords = points.map((point, index) => {
			return {
				latitude: point[0],
				longitude: point[1],
			};
		});
		return coords;
	} catch (error) {
		return error;
	}
};
