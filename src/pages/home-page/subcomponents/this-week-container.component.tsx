import React, { FC } from "react";
import IMovieResultItem from "../../../interfaces/app-types/IMovieResultItem";
import styles from "../home-page.module.scss";
import appProperties from "../../../appProperties";
import LoadingSpinner from "components/loading-spinner";
import useMovieItems from "../../../hooks/useMovieItems";
import store from "../../../store";
import { setMovieView } from "../../../store/movie-view/movie-view.actions";

const {getPosterSrcPathPrefix} = appProperties;


const ThisWeekContainer: FC = () => {

	const results = useMovieItems({name: "trendingWeek"});
	const items = results.items.filter((item, i) => i < 3) as IMovieResultItem[];

	return (
		<div className={styles.gridContainer}>
			{items.map((movie, i) => (
				<ThisWeekItem
					key={movie.id}
					item={movie}
					backgroundImage={`url(${getPosterSrcPathPrefix(i === 2 ? "500" : "400")}${movie.backdrop_path!})`}
					gridArea={`item${i + 1}`}
					onClickHandler={() => store.dispatch(setMovieView(movie))}
				/>
			))}
			{results.isLoading && <LoadingSpinner darken delay={500}/>}
		</div>
	);
};

interface ThisWeekItemProps {
	item: IMovieResultItem;
	backgroundImage: string;
	onClickHandler: () => void;
	gridArea: string;
}

const ThisWeekItem: FC<ThisWeekItemProps> = ({item: movie, backgroundImage, onClickHandler, gridArea}) => {
	return (
		<div movie-title={movie.title}
		     className={`${styles.gridItem} ${styles.hoveredBg}`}
		     style={{ gridArea }}
		     key={movie.id}
		     onClick={onClickHandler}
		>
			<div style={{ backgroundImage }}/>
		</div>
	)
};

export default ThisWeekContainer;