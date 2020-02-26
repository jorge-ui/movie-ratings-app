import React, {FC, useEffect, useRef} from 'react';
import {clearMultipleTimeouts, getMovieImgObjFromSession, isMobile} from "../../util/utilityFunctions";
import styles from './movie-item-img-bg.module.scss';
import appProperties from "../../appProperties";
import {animated, useSpring} from "react-spring";
import {easeOutCubic} from "../../util/easingFuctions";

const {posterSrcPathPrefix, searchPageTransitionConfig} = appProperties;

interface OwnProps {
    img_path: string | undefined,
    movieId: number,
    itemView?: boolean,
    className?: string
}

type Props = OwnProps;

const opacityReveal = .4;

const MovieItemImgBg: FC<Props> = ({img_path, className, movieId, itemView}) => {
    let timeout1: NodeJS.Timeout | undefined,
        timeout2: NodeJS.Timeout | undefined;


    useEffect(toClearTimeOuts, []);

    let imgRef = useRef<HTMLImageElement>(null);
    let imgSrcPath = `${posterSrcPathPrefix}${img_path}`;

    let movieImgDataObj = getMovieImgObjFromSession(movieId);
    let hasSessionData = !!movieImgDataObj;

    let [props, set] = useSpring(() => ({
        opacity: !itemView ? 0 : opacityReveal,
        config: {
            duration: 2100,
            easing: easeOutCubic
        }
    }));

    return (
        <animated.img
            src={movieImgDataObj ? movieImgDataObj.jpgData : (img_path && imgSrcPath)}
            className={`${styles.root} ${className ? className : ''}`}
            alt={''} ref={imgRef} crossOrigin={"anonymous"}
            onLoad={onLoad} style={{
                imageRendering: "pixelated",
                display: !itemView ? "none" : undefined,
                backgroundColor: movieImgDataObj && movieImgDataObj.averageColor,
                ...props
            }}
        />
    );

    function onLoad() {
        let {current} = imgRef;
        if (current) {
            let time = !itemView ? (searchPageTransitionConfig.duration * .6) : 0;
            timeout1 = setTimeout(appearElement, time);
        }
    }

    function appearElement() {
        let {current} = imgRef;
        if (current) {
            if (isMobile()) {
                current.src = '';
                if (!hasSessionData) {
                    let movieImgDataObj = getMovieImgObjFromSession(movieId);
                    current && (current.style.backgroundColor = movieImgDataObj?.averageColor || '');
                }
            }
            current.style.display = '';
            !itemView && set({opacity: opacityReveal,});
        }
    }

    function toClearTimeOuts() {
        return clearMultipleTimeouts.bind(null, timeout1, timeout2);
    }

};

MovieItemImgBg.defaultProps = {
    itemView: false
};


export default React.memo(MovieItemImgBg);