import { useEffect, useState } from "react";
import * as Location from "expo-location";

const useLocation = () => {
	const [initialRegion, setInitialRegion] = useState(null);

	useEffect(() => {
		(async () => {
			const locationPermission =
				await Location.requestForegroundPermissionsAsync();
			if (locationPermission.status === "granted") {
				const location = await Location.getCurrentPositionAsync();
				setInitialRegion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				});
			}
		})();
	}, []);

	return initialRegion;
};

export default useLocation;
