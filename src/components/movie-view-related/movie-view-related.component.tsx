import React, { FC, useEffect, useState } from "react";
import styles from "./movie-view-related.module.scss";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import IMoviesResponseData from "../../interfaces/app-types/IMoviesResponseData";
import { goFetch } from "../../util/utilityFunctions";
import appProperties from "../../appProperties";
import MovieItemsXScrollList from "../items-scroll-x/items-scroll-x.component";

const {buildFetchMovieViewUrl} = appProperties;

interface OwnProps {
	movieId: number;
	className?: string;
}

const MovieViewRelated: FC<OwnProps> = ({movieId, className}) => {

	const [relatedMovies, setRelatedMovies] = useState<IMovieResultItem[] | null>(
		null
	);

	useEffect(() => {
		let mounted = true;
		goFetch<IMoviesResponseData>(buildFetchMovieViewUrl(movieId, "/similar"))
			.then(data => {
				mounted && setRelatedMovies(data.results)
			});
		return () => { mounted = false };
	}, []);


	const noResultsFound = !!relatedMovies && !relatedMovies.length;

	return (
		<MovieItemsXScrollList
			className={`${styles.root} ${className || ''}`}
			isLoading={!relatedMovies}
			noResultsFound={noResultsFound}
			items={relatedMovies ?? undefined}
			infoTabMessage={'Related Movies \u27A5'}
			scrollByX={200}
		/>
	);
};

export default MovieViewRelated;

