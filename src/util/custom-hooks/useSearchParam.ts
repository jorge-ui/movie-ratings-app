import SearchParamsMap from "../../interfaces/app-types/SearchParamsMap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import CustomURLSearchParams from "../custom-objects/CustomURLSearchParams";
import usePrevious from "./usePrevious";
import { getHashPath, getHashQuery } from "../utilityFunctions";

type useSearchParamUpdate<Param extends keyof SearchParamsMap, ExtraParam extends keyof SearchParamsMap> =
	( value: SearchParamsMap[Param]
		| null
		| ((currentValue: SearchParamsMap[Param] | null) => SearchParamsMap[Param] | null),
	  extraParam?: [ExtraParam, SearchParamsMap[ExtraParam] | null]
	) => void

type useSearchParamReturnType<Param extends keyof SearchParamsMap> = [SearchParamsMap[Param] | undefined, useSearchParamUpdate<Param, keyof SearchParamsMap>]


function useSearchParam<Param extends keyof SearchParamsMap>
(paramName: Param, onParamChange?: (newValue: SearchParamsMap[Param] | null, oldValue: SearchParamsMap[Param] | null) => any): useSearchParamReturnType<Param> {

	const paramNameRef = useRef(paramName);
	// URL bar's searchParam with effect to keep in sync (based on [location.search])
	const [selectedParam, setSelectedParam] = useState(() => {
		return new CustomURLSearchParams(getHashQuery()).get(paramNameRef.current);
	});
	const fixSelectedParam =
		((paramNameRef.current === "movieId" || paramNameRef.current === "page") && selectedParam !== null) ?
		(Number(selectedParam) as SearchParamsMap[Param]) : selectedParam; // string because of a stupid bug in safari iOS -_-

	const selectedParamRef = useRef(fixSelectedParam);

	useLayoutEffect(() => {
		selectedParamRef.current = fixSelectedParam
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
			const oldParam = new CustomURLSearchParams(oldQuery).get(paramNameRef.current);
			const newParam = new CustomURLSearchParams(newQuery).get(paramNameRef.current);
			if (oldParam !== newParam)
				setSelectedParam(newParam);
		};
		window.addEventListener("hashchange", listener)
		return () => window.removeEventListener("hashchange", listener);
	}, []);


	// Update function for the selected searchParam
	const updateParam = useCallback<useSearchParamUpdate<Param, keyof SearchParamsMap>>((value, extraParam) => {
		if (selectedParamRef.current === value) return;
		let newSearchParams = new CustomURLSearchParams(getHashQuery());

		let newValue = (typeof value === "function") ?
			value(selectedParamRef.current as SearchParamsMap[Param])
			: value;

		if (newValue === null)
			newSearchParams.delete(paramNameRef.current);
		else newSearchParams.set(paramNameRef.current, newValue);

		if (extraParam)
			if (extraParam[1] === null) {
				newSearchParams.delete(extraParam[0]);
			} else newSearchParams.set(extraParam[0], extraParam[1]);

		// Update to new location (hash Browser)
		window.location.hash = getHashPath() + "?" + newSearchParams.toString();

	}, []);


	return [fixSelectedParam ?? undefined, updateParam];
}

export default useSearchParam;
