import React, { FC, useEffect, useState } from 'react';
import styles from './movie-item-img-bg.module.scss';
import { animated, useSpring } from "react-spring";
import { easeOutCubic } from "../../util/easingFuctions";
import { useSessionAvgColor } from "../../util/custom-hooks/useSessionAvgColor";
import useOnMovieView from "../../util/custom-hooks/useOnMovieView";
import useIsMobile from "../../util/custom-hooks/useIsMobile";


interface OwnProps {
    movieId: number,
    itemView?: boolean,
    className?: string,
}

type Props = OwnProps;


const MovieItemImgBg: FC<Props> = ({className, movieId, itemView = false}) => {
    const isMobile = useIsMobile();

    const [isRevealed, setRevealed] = useState<boolean>(itemView);

    const opacityReveal = isRevealed ? .4 : 0;

    useEffect(() => {
        let mounted = true;
        if (!itemView) { // reveal
            setTimeout(() => {
                mounted && setRevealed(true)
            }, 450);
        }
        return () => { mounted = false };
    }, []);

    const [opacityOnMovView, eventState] = useOnMovieView(movieId, opacityReveal, {
        ...(itemView ? {
            onEnter: 0,
            onClose: opacityReveal
        } : {})
    });

    let props = useSpring({
        opacity: itemView ? opacityOnMovView : opacityReveal,
        config: {
            duration: eventState === "close" ? 450 : 2100,
            easing: eventState === "close" ? undefined : easeOutCubic
        }
    });

    let imgSrc = '';

    let movieImgDataObj = useSessionAvgColor(movieId);

    if (!!movieImgDataObj?.jpgData && !isMobile)
        imgSrc = movieImgDataObj.jpgData;

    return (
        <animated.img src={imgSrc} className={`${styles.root} ${className || ''}`}
            alt={''} crossOrigin={"anonymous"} item-view={String(itemView)} style={{
                imageRendering: "pixelated",
                display: !!movieImgDataObj ? "block" : "none",
                backgroundColor: movieImgDataObj?.averageColor,
                ...props
            }}
        />
    );
};

MovieItemImgBg.defaultProps = {
    itemView: false
};


export default React.memo(MovieItemImgBg);