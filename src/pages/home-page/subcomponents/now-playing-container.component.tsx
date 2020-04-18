import React, { FC, useEffect } from 'react';
import styles from "../home-page.module.scss";
import appProperties from "../../../appProperties";
import { setMovieView } from "../../../redux/movie-view/movie-view.actions";
import { useSelector } from "react-redux";
import { HomePageState } from "../../../redux/home-page/home-page.reducer";
import { AppState, store } from "../../../redux";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner.component";
import { fetchNowPlayingAsync } from "../../../redux/home-page/home-page.actions";
import MovieItemsXScrollList from "../../../components/items-scroll-x/items-scroll-x.component";
import IMovieResultItem from "../../../interfaces/app-types/IMovieResultItem";

let {getPosterSrcPathPrefix} = appProperties;

type NowPlayingSectionState = HomePageState['nowPlayingSection'];

const NowPlayingContainer: FC = () => {

	const {isLoading, items} = useSelector<AppState, NowPlayingSectionState>(selector, stateEquality);

	useEffect(() => {
		if (!store.getState().homePage.nowPlayingSection.items) {
			// @ts-ignore
			store.dispatch(fetchNowPlayingAsync())
		}
	}, []);

	const onSetMovieView = (item: IMovieResultItem) =>
		store.dispatch(setMovieView(item))

	const mainItem = items ? items[0] : null;

	console.log("rendering now-playing-container.component");
	return (
		<div className={styles.nowPlayingContainer}>
			{(!isLoading && items && (
				<>
	                <div
	                    className={`${styles.mainMovieItem} ${styles.hoveredBg}`}
	                    movie-title={mainItem!.title}
	                    onClick={() => onSetMovieView(mainItem!)}
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
			)) || (isLoading && <LoadingSpinner darken delay={500}/>)}
		</div>
	);
};

const stateEquality = (left: NowPlayingSectionState, right: NowPlayingSectionState) => {
	return left.items?.length === right.items?.length && left.isLoading === right.isLoading;
};
const selector = ({homePage}: AppState) => homePage.nowPlayingSection;

export default NowPlayingContainer;