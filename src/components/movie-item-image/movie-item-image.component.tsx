import React, { FC } from "react";
import ImageIcon from "@material-ui/icons/Image";
import styles from "./movie-item-image.module.scss";


interface OwnProps {
	backGroundUrl: string;
	poster_path: string | null;
	itemView?: boolean;
	className?: string;
}

const MovieItemImage: FC<OwnProps> =
	({backGroundUrl, poster_path, itemView = false, className}) =>
		<div className={`${styles.root} ${className || ''}`} item-view={String(itemView)}>
			<div style={{backgroundImage: backGroundUrl}}
			     className={styles.image}>
				{!poster_path && <>
                    <ImageIcon className={styles.imageIcon}/>
                    <span>No<br/>Image</span>
                </>}
			</div>
		</div>;


export default MovieItemImage;