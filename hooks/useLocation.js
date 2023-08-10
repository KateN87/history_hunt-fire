import { useEffect, useState } from "react";
import * as Location from "expo-location";

const useLocation = () => {
	const [initialRegion, setInitialRegion] = useState(null);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		setIsPending(true);
		const getLocation = async () => {
			const location = await Location.getCurrentPositionAsync();
			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		};
		getLocation();
		setIsPending(false);
	}, []);

	return { initialRegion, isPending };
};

export default useLocation;
