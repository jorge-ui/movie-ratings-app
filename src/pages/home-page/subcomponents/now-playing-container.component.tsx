import React, { FC } from "react";
import styles from "../home-page.module.scss";
import appProperties from "appProperties";
import { setMovieView } from "store/movie-view/movie-view.actions";
import store from "store";
import LoadingSpinner from "components/loading-spinner";
import MovieItemsXScrollList from "components/items-scroll-x";
import IMovieResultItem from "../../../interfaces/app-types/IMovieResultItem";
import useMovieItems from "hooks/useMovieItems";

let {getPosterSrcPathPrefix} = appProperties;


const NowPlayingContainer: FC = () => {

	const results = useMovieItems({name: "nowPlaying"});
	const items = (results.items as IMovieResultItem[])

	const mainItem = items.length ? items[0] : null;

	return (
		<div className={styles.nowPlayingContainer}>
			{(!results.isLoading && items.length && (
				<>
	                <div
	                    className={`${styles.mainMovieItem} ${styles.hoveredBg}`}
	                    movie-title={mainItem!.title}
	                    onClick={() => store.dispatch(setMovieView(mainItem!))}
	                >
	                    <div style={{backgroundImage: `url(${getPosterSrcPathPrefix("500")}${mainItem!.backdrop_path!})`}}/>
	                </div>
	                <div className={styles.subMovieItemContainerWrapper}>
		                <MovieItemsXScrollList
			                noResultsFound={false}
			                items={items}
			                className={styles.subMovieItemContainer}
			                itemClassName={styles.subMovieItemContainerItem}
			                scrollByX={175}
		                />
	                </div>
	            </>
			)) || (results.isLoading && <LoadingSpinner darken delay={500}/>)}
		</div>
	);
};

export default NowPlayingContainer;