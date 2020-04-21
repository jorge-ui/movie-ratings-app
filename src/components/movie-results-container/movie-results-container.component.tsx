import React, { FC } from "react";
import styles from "./movie-results-container.module.scss";
import { animated, useTransition, UseTransitionProps } from "react-spring";
import usePrevious from "../../util/custom-hooks/usePrevious";
import appProperties from "../../appProperties";

let { searchPageTransitionConfig } = appProperties;

interface Props {
    page: number;
    children: (page: number) => JSX.Element | JSX.Element[] | null
}
const MovieItemsContainer: FC<Props> = ({page, children}) => {

    const prevPage = usePrevious(page);
    const isNextSlide = !prevPage || prevPage < page;
    const transition = useTransition(page, page, getTransitionConfig(isNextSlide));

    return (
        <>
            {transition.map(({key, props, item: page}) => page ?
                <animated.div key={key} className={`${styles.root} transition-page`}
                              style={{
                                  ...props,
                                  transform: props.translateX.interpolate(v =>
                                      v ? `translateX(${v}%)`: ''
                                  )
                              }}
                >
                    {children(page)}
                </animated.div> : null
            )}
        </>
    )
};

function getTransitionConfig(isNextSlide: boolean): UseTransitionProps<number> {
    let xOffset = 8;
    return {
        initial: {
            opacity: 0,
            translateX: 0,
        },
        from: {
            opacity: -.2,
            translateX: xOffset * (isNextSlide ? 1 : -1)
        },
        enter: {
            opacity: 1,
            translateX: 0
        },
        leave: {
            opacity: -.2,
            translateX: xOffset * (isNextSlide ? -1 : 1)
        },
        config: searchPageTransitionConfig,
        unique: true,
    };
}

export default MovieItemsContainer;
