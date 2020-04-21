import React, { FC } from 'react';
import { useSelector } from "react-redux";
import { AppState } from "../../redux";
import Grid from "@material-ui/core/Grid";
import styles from "../movie-results-container/movie-results-container.module.scss";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import MovieResultSkeleton from "../movie-result-skeleton/movie-result-skeleton.component";
import appProperties from "../../appProperties";

const {perPageResultsItems} = appProperties;
interface Props {
	page: number
}

interface EmptyMovieItem {
	key: number,
	id?: undefined
}
type SelectedMovies = (IMovieResultItem | EmptyMovieItem)[];

const MoviesGrid: FC<Props> = ({page}) => {
	const resultsPortion = useSelector<AppState, SelectedMovies>
	(selectMoviesPortion.bind(null, page), itemsEquality);
	return (
		<Grid container alignItems="stretch" spacing={2} className={styles.grid}>
			{resultsPortion.map(movie => (
				<Grid key={movie.key} item xs={12} sm={6} md={4}>
					{!!(movie as IMovieResultItem).id
						? <MovieResultItem movie={(movie as IMovieResultItem)}/>
						: <MovieResultSkeleton/>}
				</Grid>
			))}
		</Grid>
	);
};

const itemsEquality = (left: SelectedMovies, right: SelectedMovies) =>
	(left[0].id === right[0].id) && (left[left.length-1].id === right[right.length-1].id);
function selectMoviesPortion(page: number, {search}: AppState): SelectedMovies {
	let resultsPortion: SelectedMovies = [];
	if (!search.searchData) return resultsPortion;
	const { results, total_results } = search.searchData;
	if (results) {
		let grabIndex: number;
		let startIndex = (page ? page - 1 : page) * perPageResultsItems;
		for (let i = 0; i < perPageResultsItems; i++)
			if ((grabIndex = startIndex + i) < total_results) {
				resultsPortion[i] = results[grabIndex] || {key: grabIndex};
				resultsPortion[i].key = grabIndex;
			}
	}
	return resultsPortion;
}

export default MoviesGrid;