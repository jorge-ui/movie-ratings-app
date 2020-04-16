import { checkIsMobile } from "../utilityFunctions";
import { useEffect, useState } from 'react';


function useIsMobile() {

	const [isMobile, setIsMobile] = useState(() => checkIsMobile());

	useEffect(() => {
		const onresize = () => {
			setIsMobile(checkIsMobile())
		};
		window.addEventListener("resize", onresize);
		return () => window.removeEventListener("resize", onresize);
	}, []);

	return isMobile;
}

export default useIsMobile;