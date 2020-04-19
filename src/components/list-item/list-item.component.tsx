import React, { FC } from 'react';
import MovieItemImage from "../movie-item-image/movie-item-image.component";
import RatingProgressBar from "../circled-progress-bar/circled-progress-bar.component";
import MovieViewActionButtons from "../movie-view-actions/movie-view-actions.component";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import appProperties from "../../appProperties";
import styles from './list-item.module.scss';

const {getPosterSrcPathPrefix} = appProperties;

interface OwnProps {
	item: IMovieResultItem
}

const ListItem: FC<OwnProps> = ({item}) => {
    return (
	    <div className={styles.root}>
		    <MovieItemImage
			    backGroundUrl={`url(${getPosterSrcPathPrefix("300")}${item.poster_path})`}
			    movie={item}
			    poster_path={item.poster_path}
			    className={styles.image}
		    />
		    <div className={styles.info}>
			    <h3 className={styles.movieTitle}>{item.title}</h3>
			    <div className={styles.itemActions}>
				    <RatingProgressBar score={item.vote_average} itemView />
				    <MovieViewActionButtons item={item} className={styles.actionButtons} />
			    </div>
		    </div>
	    </div>
    );
};


export default ListItem;