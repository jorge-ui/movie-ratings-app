import React, { FC, memo, useEffect, useRef, useState } from "react";
import MovieResultItem from "components/movie-result-item";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import styles from "./movie-view-item.module.scss";
import IMovieView from "../../interfaces/app-types/IMovieView";
import MovieViewInfo from "components/movie-view-info";
import MovieViewBackground from "components/movie-view-background";
import MovieViewRelated from "components/movie-view-related";
import useOnMovieView from "hooks/useOnMovieView";
import { checkIsMobile, goFetchMovieView, isMovieView, scrollToTop } from "utility";
import MovieViewActionButtons from "components/movie-view-actions";
import RatingProgressBar from "components/circled-progress-bar";
import useIsMobile from "hooks/useIsMobile";


interface OwnProps {
    movieItem: IMovieResultItem | IMovieView;
}

const MovieViewItem: FC<OwnProps> = ({movieItem}) => {
    const movieItemRef = useRef(movieItem);
    const isMobile = useIsMobile();
    const isMovView = isMovieView(movieItem);

    const [movieView, setMovieView] = useState<IMovieView | null>(() =>
        isMovView ? movieItem as IMovieView : null
    );

    useEffect(() => {
        let ignore = false;
        if (checkIsMobile())
            scrollToTop();

        if (!isMovieView(movieItemRef.current))
            goFetchMovieView(movieItemRef.current as IMovieResultItem)
                .then(movie => !ignore && setMovieView(movie))

        return () => {
            ignore = true
        }
    }, []);

    const [ , state] = useOnMovieView(movieItem.id, false,  !isMobile ? {
        onView: true,
        onClose: false
    } : {});

    const isViewing = isMobile || state === "view";

    return (
        <div className={styles.root} id="movie-item-view">
            <MovieViewBackground movieId={movieItem.id}/>
            <div className={styles.mainInfo}>
                <MovieResultItem movie={movieItem as IMovieResultItem} itemView className={styles.movieItem}/>
                {isMobile && (
                    <>
                        <div className={styles.mobileRateActions}>
                            <RatingProgressBar score={movieItem.vote_average} itemView/>
                            <MovieViewActionButtons item={(movieItem as IMovieResultItem)} />
                        </div>
                        <p className={styles.mobileOverview}>{movieItem.overview}</p>
                    </>
                )}
                {isViewing ? <MovieViewRelated movieId={movieItem.id}/> : null}
            </div>
            <div className={styles.sideInfo}>
                {movieView && <MovieViewInfo movieView={movieView} movieId={movieItem.id} />}
            </div>
        </div>
    );
};

export default memo<OwnProps>(MovieViewItem, (prevProps, nextProps) =>
    prevProps.movieItem.id === nextProps.movieItem.id
);