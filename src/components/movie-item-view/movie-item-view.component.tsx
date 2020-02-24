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

    // @ts-ignore

    let transitionConfig = getTransitionConfig(movie, domRect);
    let prevConfig = usePrevious(transitionConfig);

    let appliedConfig = movie ? transitionConfig : prevConfig ? prevConfig : {};

    return (
        <Transition items={movie} keys={movie?.id} {...appliedConfig} >
            {(item: IMovieResultItem | null) => item && ((props) =>
                <animated.div key={item.id} className={`${className ? className : null} ${styles.root}`} style={props}>
                    <MovieResultItem movie={item} itemView/>
                </animated.div>
            )}
        </Transition>
    );
};

const mapStateToProps = ({movieItem: {domRect, item}}: AppState) => ({
    domRect,
    item
});

function getTransitionConfig(movie: IMovieResultItem | null, domRect: DOMRect | undefined) {
    let animatedDiv = document.querySelector<HTMLDivElement>(".transition-page");
    if (movie != null && !!animatedDiv && domRect !== undefined) {
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
                top: window.innerHeight*.15,
                left: animatedDomRect?.x,
                bottom: 0,
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
            }
        }
    } else return null;
}

export default connect(mapStateToProps)(MovieItemView);