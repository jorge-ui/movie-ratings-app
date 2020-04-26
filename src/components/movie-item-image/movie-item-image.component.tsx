import React, { FC } from "react";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import store from "store";
import { setMovieView } from "store/movie-view/movie-view.actions";
import ImageIcon from "@material-ui/icons/Image";
import styles from "./movie-item-image.module.scss";


interface OwnProps {
	backGroundUrl: string;
	poster_path: string | null;
	movie: IMovieResultItem;
	itemView?: boolean;
	className?: string;
}

const MovieItemImage: FC<OwnProps> =
	({movie, backGroundUrl, poster_path, itemView = false, className}) =>
		<div className={`${styles.root} ${className || ''}`} item-view={String(itemView)}>
			<div style={{backgroundImage: backGroundUrl}}
			     onClick={() => !itemView && store.dispatch(setMovieView(movie))}
			     className={styles.image}>
				{!poster_path && <>
                    <ImageIcon className={styles.imageIcon}/>
                    <span>No<br/>Image</span>
                </>}
			</div>
		</div>;


export default MovieItemImage;