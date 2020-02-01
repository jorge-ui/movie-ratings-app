import React, {ChangeEvent, FC, FormEvent, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import {fetchMoviesAsync} from "../../redux/movies/movies.actions";
import styles from "./search-bar.module.scss";

type Props = LinkActionsProps;

const SearchBar: FC<Props> = ({ fetchMoviesAsync }) => {
  let [searchText, setSearchText] = useState<string>("");

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setSearchText(target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchMoviesAsync(searchText);
  };

  return (
    <div className={styles.root}>
      <h3>Search</h3>
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <TextField id="standard-basic" label="Standard" onChange={onChange} />
      </form>
    </div>
  );
};

interface LinkActionsProps {
  fetchMoviesAsync: (searchTerm: string) => void;
}

const mapActionsToProps: LinkActionsProps = {
  fetchMoviesAsync
};

export default connect(null, mapActionsToProps)(SearchBar);
