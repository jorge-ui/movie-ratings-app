import React, { CSSProperties, FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import MovieItemImgBg from "../movie-item-img-bg/movie-item-img-bg.component";
import ImageIcon from "@material-ui/icons/Image";
import RatingProgressBar from "../circled-progress-bar/circled-progress-bar.component";
import MovieViewActionButtons from "../movie-view-actions/movie-view-actions.component";
import styles from './movie-result-item.module.scss';
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { bindActionCreators, Dispatch } from "redux";
import { MovieViewActions } from "../../redux/movie-view";
import { setMovieView } from "../../redux/movie-view/movie-view.actions";
import { connect } from "react-redux";
import appProperties from "../../appProperties";
import useOnMovieView from "../../util/custom-hooks/useOnMovieView";
import useIsMobile from "../../util/custom-hooks/useIsMobile";

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
	let {poster_path, title, vote_average, release_date, overview} = movie;

	const [imgSrcPath, setImgSrcPath] = useState(`${getPosterSrcPathPrefix()}${poster_path}`);

	const initialOnViewProps: CSSProperties = {opacity: 0, visibility: "hidden"};
	const [onMovieProps, propsState] = useOnMovieView<CSSProperties>(movie.id, initialOnViewProps, {
		...(itemView ? {
			onEnter: initialOnViewProps,
			onView: {opacity: 1, transition: "opacity 650ms ease"},
			onClose: {opacity: 0, transition: "opacity 450ms ease"}
		} : {})
	});

	const titleStyle: CSSProperties = {
		fontSize: (propsState === "view" || propsState === "enter" || isMobile) ?
			(itemView ? (isMobile ? "1.4rem" : "1.9rem") : undefined) : undefined
	};

	const [visibility, visibilityState] = useOnMovieView<OnViewConfigGeneric>
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
		}
	});

	useEffect(() => {
		if (visibilityState === "leave") {
			void itemRef.current!.offsetWidth; // this trick will trigger animation play/replay
			itemRef.current!.classList.add(styles.runAnimation);
		} else itemRef.current!.classList.remove(styles.runAnimation);
	}, [visibilityState]);
	
	
	const memoizedBackgroundImage = useMemo(() =>
		<ConnectedMovieResultItemImage
			backGroundUrl={poster_path ? `url("${imgSrcPath}")` : ''}
			poster_path={poster_path}
			movie={movie}
			itemView={itemView}
		/>, [imgSrcPath, poster_path]
	)

	return (
		<div className={`${styles.root} ${className || ''}`}
		     item-view={String(itemView)}
		     id={!itemView ? String(movie.id) : ''}
		     ref={itemRef}
		     style={{visibility}}
		>
			{!(isMobile && itemView) && <MovieItemImgBg movieId={movie.id} itemView={itemView}/>}
			<div className={styles.imageWrapper}>
				{memoizedBackgroundImage}
			</div>
			<div className={styles.content}>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.title} style={titleStyle}>{title}</div>
						{release_date && (
							<div className={styles.year}>{release_date.substr(0, 4)}</div>
						)}
						{itemView && !isMobile && (
							<p className={styles.overViewSection} style={onMovieProps}>{overview}</p>
						)}
					</div>
					{!(isMobile && itemView) && (
						<div className={styles.info}>
							<div><RatingProgressBar score={vote_average} itemView={itemView}/></div>
							<div style={onMovieProps}><MovieViewActionButtons movieId={movie.id} /></div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface MovieResultItemImageProps {
    backGroundUrl: string;
    poster_path: string | null;
    movie: IMovieResultItem;
    itemView: boolean;
}

const MovieResultItemImage: FC<MovieResultItemImageProps & ReturnType<typeof mapDispatchToProps>> =
    memo(({movie, backGroundUrl, poster_path, onSetMovieItem, itemView}) => {
        return (
            <div style={{backgroundImage: backGroundUrl}}
                 onClick={() => !itemView && onSetMovieItem(movie)}
                 className={styles.image}>
                {!poster_path && <>
                    <ImageIcon className={styles.imageIcon}/>
                    <span>No<br/>Image</span>
                </>}
            </div>
        );
    }, (prevProps, nextProps) => prevProps.backGroundUrl === nextProps.backGroundUrl );

const mapDispatchToProps = (dispatch: Dispatch<MovieViewActions>) =>
    bindActionCreators({
        onSetMovieItem: setMovieView,
    }, dispatch);

const ConnectedMovieResultItemImage = connect(null, mapDispatchToProps)(MovieResultItemImage);

const onViewConfigNotItemView = {
	onEnter: "hidden" as OnViewConfigGeneric,
	onLeave: "visible" as OnViewConfigGeneric
};


export default MovieResultItem;