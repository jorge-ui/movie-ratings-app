import { useEffect, useRef, useState } from "react";
import MovieViewEvent, { MovieViewEventState } from "../utility/custom-events/MovieViewEvent";
import capitalize from "@material-ui/core/utils/capitalize";


interface OnMovieViewConfig<T> {
	onEnter?:  T | (() => T);
	onUpdate?: T | (() => T);
	onView?:   T | (() => T);
	onClose?:  T | (() => T);
	onLeave?:  T | (() => T);
}

type HookState<T> = [T, MovieViewEventState | "initial"]

function useOnMovieView<T>(id: number, initial: T, config: OnMovieViewConfig<T>): HookState<T> {
	const idRef = useRef(id);
	const configRef = useRef(config);

	const [props, setProps] = useState<HookState<T>>([initial, "initial"]);


	useEffect(() => {idRef.current = id}, [id]);
	useEffect(() => {configRef.current = config}, [config]);


	useEffect(() => {
		let mounted = true;

		function onEvent({detail:{state, movieId}}: MovieViewEvent) {
			if (movieId !== idRef.current) return;

			const configPropName = `on${capitalize(state)}` as keyof OnMovieViewConfig<T>;

			if (configPropName in configRef.current) {

				let configProp = configRef.current[configPropName]!;
				// @ts-ignore (because the truthy ternary expression is indeed callable)
				let newStateProps = typeof configProp === "function" ? configProp() : configProp;

				mounted && setProps([newStateProps, state]);
			}
		}
		window.addEventListener("movieView", onEvent);
		return () => {
			mounted = false;
			window.removeEventListener("movieView", onEvent);
		}
	}, []);

	return props;
}

export default useOnMovieView;