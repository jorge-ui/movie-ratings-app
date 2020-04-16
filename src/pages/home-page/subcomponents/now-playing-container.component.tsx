import React, { FC, useEffect } from 'react';
import styles from "../home-page.module.scss";
import appProperties from "../../../appProperties";
import { bindActionCreators, Dispatch } from "redux";
import { MovieViewActions } from "../../../redux/movie-view";
import { setMovieView } from "../../../redux/movie-view/movie-view.actions";
import { connect, useSelector } from "react-redux";
import { HomePageState } from "../../../redux/home-page/home-page.reducer";
import { AppState } from "../../../redux";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner.component";
import { fetchNowPlayingAsync } from "../../../redux/home-page/home-page.actions";
import MovieItemsXScrollList from "../../../components/items-scroll-x/items-scroll-x.component";

let {getPosterSrcPathPrefix} = appProperties;

type NowPlayingSectionState = HomePageState['nowPlayingSection'];

const NowPlayingContainer: FC<ReturnType<typeof mapDispatchToProps>> = ({onSetMovieView, onFetchNowPlayingAsync}) => {

	const {isLoading, items} = useSelector<AppState, NowPlayingSectionState>(selector, stateEquality);

	useEffect(() => {
		if (!items) onFetchNowPlayingAsync();
	}, []);

	const mainItem = items ? items[0] : null;

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

const mapDispatchToProps = (dispatch: Dispatch<MovieViewActions>) =>
	bindActionCreators({
		onSetMovieView: setMovieView,
		onFetchNowPlayingAsync: fetchNowPlayingAsync
	}, dispatch);

export default connect(null, mapDispatchToProps)(NowPlayingContainer);