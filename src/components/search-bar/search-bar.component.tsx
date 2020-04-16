import React, { FC, FormEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import styles from "./search-bar.module.scss";
import useSearchParam from "../../util/custom-hooks/useSearchParam";
import SearchBarSuggestions from "./search-bar-suggestions.component";


interface OwnProps {
    className?: string,
}
let isMounted: boolean;
const SearchBar: FC<OwnProps> = ({ className }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState("");

    const [searchParam = '', setSearchParam] = useSearchParam("s");
    const [inputTxt, setInputTxt] = useState(searchParam);
    const [keyWord, setKeyWord] = useState('');

    const [isFocus, setFocus] = useState(false);

    const setFocusOn = useCallback(() => isMounted && setFocus(prevState => {
        if (prevState) return prevState;
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 380);
        return true;
    }), []);

    const setFocusOff = useCallback(() => isMounted && setFocus(prevState => {
        if (!prevState) return prevState;
        inputRef.current?.blur();
        setError("");
        return false;
    }), []);


    function onSubmit (e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        let searchTerm = inputRef.current?.value || '';

        if (!searchTerm)
            return setError("Search can't be empty.");

        if (searchParam !== searchTerm) {
            setFocusOff();
            error && setError("");
            setTimeout(() => setSearchParam(searchTerm, ["page", 1]), 150);
        } else {
            setError("Search results already showing.");
        }

        setInputTxt(searchTerm);
        setKeyWord('');
    }

    useEffect(() => {
        isMounted = true;
        const listener = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Slash": setTimeout(setFocusOn ,50);
                    break;
                case "Escape": setFocusOff();
                    break;
                default: break;
            }
        };
        window.addEventListener("keydown", listener);
        return () => {
            isMounted = false;
            window.removeEventListener("keydown", listener);
        }
    }, []);

    useLayoutEffect(() => {
        setFocus(!searchParam);
    }, [searchParam]);


    return (
        <div className={`${styles.root} ${className || ''}`} is-focused={`${isFocus}`}>
            <form autoComplete="off" onSubmit={onSubmit}>
                <TextField
                    className={styles.bar}
                    label="Movie Search"
                    error={!!error}
                    helperText={error}
                    onBlur={() => {
                        if (!searchParam || keyWord) return;
                        setFocusOff();
                    }}
                    inputRef={inputRef}
                    name={"searchTerm"}
                    value={inputTxt}
                    onChange={({target}) => {
                        setInputTxt(target.value);
                        setKeyWord(target.value);
                    }}
                    onFocus={setFocusOn}
                    inputProps={{
                        id: "search-bar-input",
                        onClick: event => event.preventDefault(),
                        onKeyDown: (e) => (e.key === "ArrowUp" || e.key === "ArrowDown") && e.preventDefault()
                    }}
                />
            </form>
            {!!keyWord && isFocus &&
                <SearchBarSuggestions
                    keyword={keyWord}
                    onSubmit={onSubmit}
                    inputRef={inputRef}
                />
            }
        </div>
    );
};

export default React.memo(SearchBar, () => true);
