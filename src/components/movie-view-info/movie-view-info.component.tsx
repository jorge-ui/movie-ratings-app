import React, { FC } from 'react';
import IMovieView from "../../interfaces/app-types/IMovieView";
import { getMovieImgObjFromSession } from "../../util/utilityFunctions";
import styles from './movie-view-info.module.scss';
import { fade } from '@material-ui/core';
import { animated, useSpring } from "react-spring";
import { easeOutQuart } from "../../util/easingFuctions";
import MovieViewInfoChildren from "./movie-view-info-children.component";
import useOnMovieView from "../../util/custom-hooks/useOnMovieView";
import useIsMobile from "../../util/custom-hooks/useIsMobile";

interface OwnProps {
    movieView: IMovieView | undefined;
    movieId: number;
}

type Props = OwnProps;

const defaultBgColor = 'rgba(160, 160, 160, .2)';

const MovieViewInfo: FC<Props> = ({movieView, movieId}) => {
    const isMobile = useIsMobile();
    const [left, propsState] = useOnMovieView(movieId, !isMobile ? 105 : 0, !isMobile ? {
        onView: 0,
        onClose: 0
    } : {});

    const opacity = propsState === "close" ? 0 : 1;

    const props = useSpring({
        left,
        config: {
            duration: 900,
            easing: easeOutQuart
        }
    });

    let colorSessionObj = getMovieImgObjFromSession(movieId);

    let backgroundColor = colorSessionObj ? fade(colorSessionObj.averageColor, .2) : defaultBgColor;

    return (
        <animated.div className={styles.root} style={{
            left: props.left.to(v => v+"%"),
            backgroundColor,
            opacity
        }}>
            {movieView && <MovieViewInfoChildren movieView={(movieView as IMovieView)} />}
        </animated.div>
    );
};

export default MovieViewInfo;