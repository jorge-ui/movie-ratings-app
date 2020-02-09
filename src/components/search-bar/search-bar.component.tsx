import React, {ChangeEvent, FC, FormEvent, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import {fetchMoviesAsync} from "../../redux/movies/movies.actions";
import styles from "./search-bar.module.scss";
import {AppState} from "../../redux/root-reducer";
import {selectMoviesCurrentSearchKeyword} from "../../redux/movies/movies.selectors";
import {bindActionCreators, Dispatch} from "redux";
import {MoviesActions} from "../../interfaces/action-types/MoviesActions";

interface OwnProps {
    className?: string;
}

type Props = ReturnType<typeof mapDispatchToProps> &
    ReturnType<typeof mapStateToProps> &
    OwnProps;

const SearchBar: FC<Props> = ({
                                  className,
                                  fetchMoviesAsync,
                                  currentSearchKeyword,
                                  ...rest
                              }) => {
    let [searchText, setSearchText] = useState<string>("");

    const onChange = ({target}: ChangeEvent<HTMLInputElement>) =>
        setSearchText(target.value);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentSearchKeyword !== searchText) fetchMoviesAsync(searchText);
        else {
            // TODO: animate results already showing
        }
    };

    return (
        <div className={styles.root + " " + className} {...rest}>
            <form noValidate autoComplete="off" onSubmit={onSubmit}>
                <TextField
                    className={styles.bar}
                    required
                    label="Movie Search"
                    onChange={onChange}
                    fullWidth
                />
            </form>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    currentSearchKeyword: selectMoviesCurrentSearchKeyword(state)
});

const mapDispatchToProps = (dispatch: Dispatch<MoviesActions>) =>
    bindActionCreators(
        {
            fetchMoviesAsync
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
