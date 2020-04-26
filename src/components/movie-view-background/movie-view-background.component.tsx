import React, { CSSProperties, FC } from "react";
import styles from "./movie-view-background.module.scss";
import { fade } from "@material-ui/core";
import { useSessionAvgColor } from "hooks/useSessionAvgColor";
import useOnMovieView from "hooks/useOnMovieView";


interface OwnProps {
    movieId: number
}

type Props = OwnProps;

const bgColorOpacity = .6;
const defaultBgColor = `rgba(160, 160, 160, ${bgColorOpacity})`;

const MovieViewBackground: FC<Props> = ({movieId}) => {

    const movieImgDataObj = useSessionAvgColor(movieId);

    const [cssProps] = useOnMovieView<CSSProperties>(movieId, {opacity: 0}, {
        onView: {
            opacity: 1,
            transitionDuration: "800"
        },
        onClose: {
            opacity: 0,
            transitionDuration: "450"
        }
    });

    let bgColor = defaultBgColor;

    if (movieImgDataObj)
        bgColor = fade(movieImgDataObj.averageColor, bgColorOpacity);

    let bgStyle: CSSProperties = {
        background: `linear-gradient(180deg, transparent 0%, ${bgColor} 100%)`
    };

    return (
        <div style={{...bgStyle, ...cssProps}} className={styles.root}/>
    );
};


export default React.memo(MovieViewBackground, () => true);