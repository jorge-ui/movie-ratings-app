import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import MovieResultItem from "components/movie-result-item";
import MovieResultSkeleton from "components/movie-result-skeleton";
import styles from "./movies-grid.module.scss";
import { ItemsPortionUI } from "hooks/useMovieItems";

interface Props {
	items: ItemsPortionUI
}

const MoviesGrid: FC<Props> = ({items}) => {
	return (
		<Grid container alignItems="stretch" spacing={2} className={styles.root}>
			{items.map(movie => (
				<Grid key={movie.key} item xs={12} sm={6} md={4}>
					{!!(movie as IMovieResultItem).id
						? <MovieResultItem movie={(movie as IMovieResultItem)}/>
						: <MovieResultSkeleton/>}
				</Grid>
			))}
		</Grid>
	);
};

export default MoviesGrid;