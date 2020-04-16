import { useEffect, useState } from "react";
import { goFetch } from "../utilityFunctions";


function useFetch<T>
	(url: string, callBack?: (data: T) => void, initialValue?: any, options?: RequestInit): T {
	const [result, setResult] = useState<T>(initialValue);

	useEffect(() => {
		let isMounted = true;
		goFetch<T>(url, options)
			.then(data => {
				if (isMounted) {
					setResult(data);
					callBack && callBack(data);
				}
			})
			.catch(console.log);
		return () => { isMounted = false; }
	}, []);

	return result;
}

export default useFetch;