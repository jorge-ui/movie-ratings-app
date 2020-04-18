import { DependencyList, EffectCallback, useEffect, useRef } from "react";


function useEffectSkipFirst(effect: EffectCallback, deps?: DependencyList) {
	const isFirstRun = useRef(true);
	const effectRef = useRef(effect);

	useEffect(() => {
		effectRef.current = effect;
	}, deps);

	useEffect (() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		return effectRef.current();
	}, deps);
}

export default useEffectSkipFirst;