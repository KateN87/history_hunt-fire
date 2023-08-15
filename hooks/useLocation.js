import { useEffect, useState } from "react";
import * as Location from "expo-location";
import usePermission from "./usePermission";

const useLocation = () => {
	const [initialRegion, setInitialRegion] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const hasLocatePermissions = usePermission();

	useEffect(() => {
		setIsPending(true);
		const getLocation = async () => {
			if (hasLocatePermissions) {
				const location = await Location.getCurrentPositionAsync();
				setInitialRegion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				});
			}
		};
		getLocation();
		setIsPending(false);
	}, [hasLocatePermissions]);

	return { initialRegion, isPending, hasLocatePermissions };
};

export default useLocation;
