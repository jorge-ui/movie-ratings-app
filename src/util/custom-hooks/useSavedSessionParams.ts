import { useLayoutEffect } from "react";
import { getHashPath, getHashQuery } from "../utilityFunctions";

function onHashChange(e: HashChangeEvent) {
	const pathURL = e.newURL.split("#")[1];
	const [locationPath, searchQuery = ''] = pathURL.split("?");
	sessionStorage.setItem(locationPath, searchQuery);
}

function useSavedSessionParams() {
	useLayoutEffect(() => {
		const hashPath = getHashPath();
		const savedPathParams = sessionStorage.getItem(hashPath);

		if (savedPathParams && !getHashQuery())
			window.location.hash = hashPath + "?" + savedPathParams;

		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange)
	}, [])
}

export default useSavedSessionParams;