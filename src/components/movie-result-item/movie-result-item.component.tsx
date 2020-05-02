import React, { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";
import MovieItemImgBg from "components/movie-item-img-bg";
import RatingProgressBar from "components/circled-progress-bar";
import MovieViewActionButtons from "components/movie-view-actions";
import styles from "./movie-result-item.module.scss";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import appProperties from "../../appProperties";
import useOnMovieView from "hooks/useOnMovieView";
import useIsMobile from "hooks/useIsMobile";
import MovieItemImage from "components/movie-item-image";
import store from "../../store";
import { setMovieView } from "../../store/movie-view/movie-view.actions";

const {getPosterSrcPathPrefix} = appProperties;

interface OwnProps {
	movie: IMovieResultItem;
	itemView?: boolean;
	className?: string;
}

type OnViewConfigGeneric = "hidden" | "visible";

const MovieResultItem: FC<OwnProps> = ({movie, className, itemView = false}) => {
	const isMobile = useIsMobile();
	const itemRef = useRef<HTMLDivElement>(null);
	const {poster_path, title, vote_average, release_date, overview} = movie;

	const [imgSrcPath, setImgSrcPath] = useState(() => {
		const size = isMobile ? "500" : undefined;
		return `${getPosterSrcPathPrefix(size)}${poster_path}`;
	});

	const [visibility, propsState] = useOnMovieView<OnViewConfigGeneric>
	(movie.id, "visible", !itemView ? onViewConfigNotItemView : {
		onView: () => {
			if (itemView && poster_path) { // this is to make image look better (higher quality)
				let newSrc = `${getPosterSrcPathPrefix("500")}${poster_path}`;
				let image = new Image();
				// set newSrc upon cached response for better UX
				image.onload = () => setImgSrcPath(newSrc);
				image.src = newSrc;
			}
			return "visible";
		},
		onClose: "visible",
		onEnter: "visible"
	});

	const titleStyle: CSSProperties = {
		fontSize: (propsState === "view" || propsState === "enter" || isMobile) ?
			(itemView ? (isMobile ? "1.4rem" : "1.9rem") : undefined) : undefined
	};

	useEffect(() => {
		if (propsState === "leave") {
			void itemRef.current!.offsetWidth; // this trick will trigger animation play/replay
			itemRef.current!.classList.add(styles.runAnimation);
		} else itemRef.current!.classList.remove(styles.runAnimation);
	}, [propsState]);
	
	
	const memoizedItemImage = useMemo(() =>
		<MovieItemImage
			backGroundUrl={poster_path ? `url("${imgSrcPath}")` : ''}
			poster_path={poster_path}
			itemView={itemView}
		/>, [imgSrcPath, poster_path]
	)

	return (
		<div className={`${styles.root} ${className || ''}`}
		     item-view={String(itemView)}
		     id={!itemView ? String(movie.id) : ''}
		     ref={itemRef}
		     style={{visibility}}
		     onClick={() => !itemView && store.dispatch(setMovieView(movie))}
		>
			{!(isMobile && itemView) && <MovieItemImgBg movieId={movie.id} itemView={itemView}/>}
			{memoizedItemImage}
			<div className={styles.content}>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.title} style={titleStyle}>{title}</div>
						{release_date && (
							<div className={styles.year}>{release_date.substr(0, 4)}</div>
						)}
						{itemView && !isMobile && propsState === "view" && (
							<p className={styles.overViewSection}>{overview}</p>
						)}
					</div>
					{!(isMobile && itemView) && (
						<div className={styles.info}>
							<div><RatingProgressBar score={vote_average} itemView={itemView}/></div>
							{itemView && propsState === "view" && <MovieViewActionButtons item={movie}/>}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const onViewConfigNotItemView = {
	onEnter: "hidden" as OnViewConfigGeneric,
	onLeave: "visible" as OnViewConfigGeneric
};


export default MovieResultItem;