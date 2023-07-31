const GOOGLE_API_KEY = "AIzaSyBTP5sWCK8CsfgU-U-65RsewWr0lL1QqFs";

export const createLocationUrl = ({ lat, lng }) => {
	return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
    &markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
};

/* `https://maps.googleapis.com/maps/api/staticmap?center=57.7020599,12.0159034&zoom=14&size=400x200&maptype=roadmap
    &markers=color:red%7Clabel:S%7C57.7020599,12.0159034&key=AIzaSyBTP5sWCK8CsfgU-U-65RsewWr0lL1QqFs`; */
