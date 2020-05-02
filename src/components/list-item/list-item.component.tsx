import React, { FC } from "react";
import MovieItemImage from "components/movie-item-image";
import RatingProgressBar from "components/circled-progress-bar";
import MovieViewActionButtons from "components/movie-view-actions";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import appProperties from "../../appProperties";
import styles from "./list-item.module.scss";
import { setMovieView } from "store/movie-view/movie-view.actions";
import store from "store";
import { isMovieItem, PortionItemUI } from "../../hooks/useMovieItems";
import LoadingSpinner from "../loading-spinner";

const {getPosterSrcPathPrefix} = appProperties;

interface OwnProps {
	item: PortionItemUI
}
const ListItem: FC<OwnProps> = ({item}) => {

	const onSetMovieView = (item: IMovieResultItem) =>
		store.dispatch(setMovieView(item))

    return (
	    <div className={styles.root}>
		    {isMovieItem(item) ? <>
			    <MovieItemImage
				    backGroundUrl={`url(${getPosterSrcPathPrefix("300")}${item.poster_path})`}
				    poster_path={item.poster_path}
				    className={styles.image}
			    />
			    <div className={styles.info}>
				    <h3 className={styles.movieTitle}
				        onClick={() => onSetMovieView(item!)}
				    >{item.title}</h3>
				    <div className={styles.itemActions}>
					    <RatingProgressBar score={item.vote_average} itemView/>
					    <MovieViewActionButtons item={item} className={styles.actionButtons}/>
				    </div>
			    </div>
		    </> : <LoadingSpinner delay={100} darken />}
	    </div>
    );
};


export default ListItem;