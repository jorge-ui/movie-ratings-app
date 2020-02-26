import React, {FC} from 'react';
import MovieResultItem from "../movie-result-item/movie-result-item.component";
import {AppState} from "../../redux/root-reducer";
import {connect} from "react-redux";
import styles from './movie-item-view.module.scss';
import {animated, config} from "react-spring";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import {Transition} from "react-spring/renderprops";
import usePrevious from "../../util/usePrevious";


interface OwnProps {
    className?: string
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const MovieItemView: FC<Props> = ({className, item: movie, domRect}) => {


    let transitionConfig = getTransitionConfig(movie, domRect);
    let prevConfig = usePrevious(transitionConfig);

    let appliedConfig = movie ? transitionConfig : prevConfig ? prevConfig : {};

    return (
        <Transition items={movie} keys={movie?.id} {...appliedConfig} >
            {(item: IMovieResultItem | null) => item && ((props) =>
                <animated.div key={item.id} className={`${className ? className : ''} ${styles.root}`} style={props}>
                    <div className={styles.viewWrapper} >
                        <MovieResultItem movie={item} itemView className={styles.movieItem}/>
                    </div>
                </animated.div>
            )}
        </Transition>
    );
};

function getTransitionConfig(movie: IMovieResultItem | null, domRect: DOMRect | null) {
    let animatedDiv = document.querySelector<HTMLDivElement>(".transition-page");
    if (!!movie && !!animatedDiv && !!domRect) {
        let animatedDomRect = animatedDiv.getBoundingClientRect();

        let initialPosition = {
            top: domRect.top,
            left: domRect.left,
            bottom: (window.innerHeight - domRect.bottom),
            width: domRect.width
        };

        return {
            from: initialPosition,
            enter: {
                top: window.innerHeight*.10,
                left: animatedDomRect?.x,
                bottom: -10,
                width: animatedDomRect?.width
            },
            leave: {
                ...initialPosition,
                config: {
                    ...config.stiff,
                    clamp: true
                }
            },
            config: {
                ...config.stiff,
                tension: config.stiff.tension && config.stiff.tension*1.3
            },
            onStart: (item: IMovieResultItem | null, state: string) => {
                if (state === "enter" && item)
                    document.dispatchEvent(new CustomEvent("itemView", {
                        detail: {
                            movieId: item.id,
                            visibility: "hidden"
                        }
                    }))
            },
            onRest: (item: IMovieResultItem | null, state: string) => {
                if (state === "leave" && item)
                    document.dispatchEvent(new CustomEvent("itemView", {
                        detail: {
                            movieId: item.id,
                            visibility: "visible"
                        }
                    }))
            }
        }
    } else return null;
}

const mapStateToProps = ({movieItem: {domRect, item}}: AppState) => ({
    domRect,
    item
});

export default connect(mapStateToProps)(MovieItemView);