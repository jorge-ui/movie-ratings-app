import React, { FC, useEffect } from 'react';
import IMovieResultItem from "../../../interfaces/app-types/IMovieResultItem";
import styles from "../home-page.module.scss";
import appProperties from "../../../appProperties";
import { connect, useSelector } from "react-redux";
import { AppState } from "../../../redux";
import { HomePageState } from "../../../redux/home-page/home-page.reducer";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner.component";
import { IMovieViewActions } from "../../../redux/movie-view";
import { bindActionCreators, Dispatch } from "redux";
import { setMovieView } from "../../../redux/movie-view/movie-view.actions";
import { fetchThisWeekAsync } from "../../../redux/home-page/home-page.actions";

const {getPosterSrcPathPrefix} = appProperties;

type ThisWeekSectionState = HomePageState['thisWeekSection'];

const ThisWeekContainer: FC<ReturnType<typeof mapDispatchToProps>> = ({onSetMovieView, onFetchThisWeekAsync}) => {

	const {isLoading, items} = useSelector<AppState, ThisWeekSectionState>
		(({homePage}) => homePage.thisWeekSection, stateEquality);

	useEffect(() => {
		if (!items) onFetchThisWeekAsync()
	}, []);

	return (
		<div className={styles.gridContainer}>
			{items?.map((movie, i) => (
				<ThisWeekItem
					key={movie.id}
					item={movie}
					backgroundImage={`url(${getPosterSrcPathPrefix(i === 2 ? "500" : "400")}${movie.backdrop_path!})`}
					gridArea={`item${i + 1}`}
					onClickHandler={() => onSetMovieView(movie)}
				/>
			))}
			{isLoading && <LoadingSpinner darken delay={500}/>}
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

const stateEquality = (left: ThisWeekSectionState, right: ThisWeekSectionState) => {
	return left.items?.length === right.items?.length && left.isLoading === right.isLoading;
};

const mapDispatchToProps = (dispatch: Dispatch<IMovieViewActions>) =>
    bindActionCreators({
            onSetMovieView: setMovieView,
	        onFetchThisWeekAsync: fetchThisWeekAsync
        },dispatch);

export default connect(null, mapDispatchToProps)(ThisWeekContainer);