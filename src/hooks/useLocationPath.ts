import { useLayoutEffect, useState } from "react";
import { getHashPath } from "utility";


function useLocationPath() {
	const [path, setPath] = useState('/');

	useLayoutEffect(() => {
		setPath(getHashPath())
		const listener = ({oldURL, newURL}: HashChangeEvent) => {
			const oldPath = getHashPath(oldURL), newPath = getHashPath(newURL);
			if (oldPath !== newPath)
				setPath(newPath);
		};
		window.addEventListener("hashchange", listener)
		return () => window.removeEventListener("hashchange", listener);
	}, []);

	return path;
}

export default useLocationPath;