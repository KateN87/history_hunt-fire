import { useEffect, useState } from "react";
import * as Location from "expo-location";

const usePermission = () => {
	const [hasLocatePermissions, setHasLocatePermissions] = useState(undefined);

	useEffect(() => {
		(async () => {
			const locationPermission =
				await Location.requestForegroundPermissionsAsync();
			setHasLocatePermissions(locationPermission.status === "granted");
		})();
	}, []);

	return hasLocatePermissions;
};

export default usePermission;
