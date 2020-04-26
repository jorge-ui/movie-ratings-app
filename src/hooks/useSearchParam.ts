import SearchParamsMap from "../interfaces/app-types/SearchParamsMap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import usePrevious from "./usePrevious";
import { fixParamValue, getHashPath, getHashQuery } from "utility";

type useSearchParamUpdate<Param extends keyof SearchParamsMap, Extra extends keyof SearchParamsMap = keyof SearchParamsMap> =
	(
		value: SearchParamsMap[Param] | null | ((currentValue: SearchParamsMap[Param] | null) => SearchParamsMap[Param] | null),
	    extraParam?: [Extra, SearchParamsMap[Extra] | null]
	) => void

type useSearchParamReturnType<Param extends keyof SearchParamsMap> = [SearchParamsMap[Param] | undefined, useSearchParamUpdate<Param>]
type onParamChangeType<Param extends keyof SearchParamsMap> = (newValue: SearchParamsMap[Param] | null, oldValue: SearchParamsMap[Param] | null) => any;

function useSearchParam<Param extends keyof SearchParamsMap>
(paramName: Param, onParamChange?: onParamChangeType<Param>): useSearchParamReturnType<Param> {

	const paramNameRef = useRef(paramName);
	// URL bar's searchParam with effect to keep in sync (based on [location.movies-browser])
	const [selectedParam, setSelectedParam] = useState(() => {
		return new URLSearchParams(getHashQuery()).get(paramNameRef.current);
	});
	const fixSelectedParam = fixParamValue<Param>(selectedParam) // convert value to correct data type

	const selectedRef = useRef(fixSelectedParam);

	useLayoutEffect(() => {
		selectedRef.current = fixSelectedParam
	}, [fixSelectedParam]);

	const oldSelectedParam = usePrevious(fixSelectedParam) || null;

	useEffect(() => {
		if (oldSelectedParam !== fixSelectedParam)
			onParamChange && onParamChange(fixSelectedParam, oldSelectedParam);
	}, [fixSelectedParam, onParamChange, oldSelectedParam]);

	useEffect(() => {
		const listener = ({oldURL, newURL}: HashChangeEvent) => {
			if (oldURL === newURL) return;
			const oldQuery = getHashQuery(oldURL);
			const newQuery = getHashQuery(newURL);
			const oldParam = new URLSearchParams(oldQuery).get(paramNameRef.current);
			const newParam = new URLSearchParams(newQuery).get(paramNameRef.current);
			if (oldParam !== newParam)
				setSelectedParam(newParam);
		};
		window.addEventListener("hashchange", listener)
		return () => window.removeEventListener("hashchange", listener);
	}, []);


	// Update function for the selected searchParam
	const updateParam = useCallback<useSearchParamUpdate<Param>>((value, extraParam) => {
		if (selectedRef.current === value && !extraParam) return;
		let newSearchParams = new URLSearchParams(getHashQuery());

		let newValue = (typeof value === "function") ?
			value(selectedRef.current)
			: value;

		if (newValue === null)
			newSearchParams.delete(paramNameRef.current);
		else newSearchParams.set(paramNameRef.current, String(newValue));

		if (extraParam) {
			if (extraParam[1] === null)
				newSearchParams.delete(extraParam[0]);
			else newSearchParams.set(extraParam[0], String(extraParam[1]));
		}

		// Update to new location (hash Browser)
		window.location.hash = getHashPath() + "?" + newSearchParams.toString();

	}, []);


	return [fixSelectedParam ?? undefined, updateParam];
}

export default useSearchParam;
