import React, {FC, FormEvent, useEffect, useRef, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import {fetchMoviesAsync} from "../../redux/movies/movies.actions";
import styles from "./search-bar.module.scss";
import {bindActionCreators, Dispatch} from "redux";
import {IMoviesActions} from "../../interfaces/action-types/IMoviesActions";

interface OwnProps {
    className?: string,
    currentSearchTerm: string
}

type Props = ReturnType<typeof mapDispatchToProps> & OwnProps;

const SearchBar: FC<Props> = ({className, fetchMoviesAsync, currentSearchTerm}) => {
    let inputRef = useRef<HTMLInputElement>(null);
    let [error, setError] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        let searchText = inputRef.current?.value;
        e.preventDefault();
        if (!searchText || !searchText.length)
            return setError("Search can't be empty.");

        if (currentSearchTerm !== searchText) {
            fetchMoviesAsync(searchText);
            error && setError("");
        } else {
            setError("Search results already showing.");
            // TODO: animate results already showing
        }
    };

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            let element = inputRef.current;
            switch (e.code) {
                case "Slash":
                    if (!!element && document.activeElement !== element)
                        setTimeout(() => {
                            (element as HTMLInputElement).focus();
                            (element as HTMLInputElement).select();
                        },50);
                    break;
                case "Escape":
                    if (!!element && document.activeElement === element)
                        (element as HTMLInputElement).blur();
                    break;
                default:
                    break;
            }

        };
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);

    return (
        <div className={styles.root + " " + className}>
            <form autoComplete="off" onSubmit={onSubmit}>
                <TextField
                    className={styles.bar}
                    label="Movie Search"
                    error={!!error}
                    helperText={error}
                    onBlur={() => setError("")}
                    inputRef={inputRef}
                    inputProps={{
                        id: "search-bar-input"
                    }}
                />
            </form>
        </div>
    );
};


const mapDispatchToProps = (dispatch: Dispatch<IMoviesActions>) =>
    bindActionCreators({fetchMoviesAsync}, dispatch);

export default connect(null, mapDispatchToProps)(SearchBar);
