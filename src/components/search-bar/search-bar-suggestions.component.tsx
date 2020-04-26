import React, { FC, RefObject, useEffect, useState } from "react";
import styles from "./search-bar.module.scss";
import appProperties from "../../appProperties";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

const {buildFetchMovieSearchUrl} = appProperties;

interface OwnProps {
	keyword: string
	onSubmit: () => void;
	inputRef: RefObject<HTMLInputElement>
}
const SearchBarSuggestions: FC<OwnProps> = ({keyword,  onSubmit, inputRef}) => {

	const [suggestions, setSuggestions] = useState<IMovieResultItem[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let isMount = true;
		setTimeout(() => isMount && setVisible(true), 360);
		return () => { isMount = false; }
	}, []);

	useEffect(() => {
		let isEffect = true;
		setTimeout(() => {
			isEffect && fetch(buildFetchMovieSearchUrl(keyword))
				.then(res => isEffect && res.json())
				.then(data => {
					if (!isEffect) return;
					setSuggestions(data.results.slice(0, 12) ?? []);
					setSelected(null);
				})
				.catch(console.log)
		}, 300);
		return () => {
			isEffect = false;
		}
	}, [keyword]);

	useEffect(() => {
		const listener = (ev: KeyboardEvent) => {
			if (!suggestions.length) return;
			switch (ev.code) {
				case "ArrowUp":
					return setSelected(selected => {
							let newSelected =
								selected ? Math.abs(--selected % suggestions.length) : suggestions.length - 1;
							inputRef.current!.value = suggestions[newSelected].title;
							return newSelected;
						}
					);
				case "ArrowDown":
					return setSelected(selected => {
							let newSelected =
								selected !== null ? Math.abs(++selected % suggestions.length) : 0;
							inputRef.current!.value = suggestions[newSelected].title;
							return newSelected;
						}
					);
				default: break;
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, [inputRef, suggestions]);


	const handleClickSubmit = (title: string) => {
		inputRef.current!.value = title;
		onSubmit()
	};


    return visible && suggestions.length ? (
        <ul className={styles.suggestionsDropdown}
            onMouseLeave={() => setSelected(null)}
        >
	        {suggestions.map(({id, title}, index) => (
		        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
	        	<li key={id} aria-selected={(index === selected)}
		            onMouseEnter={() => setSelected(index)}
		            onClick={handleClickSubmit.bind(null, title)}
		        >{title}</li>
	        ))}
        </ul>
    ) : null;
};


export default SearchBarSuggestions;