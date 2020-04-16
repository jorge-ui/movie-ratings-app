import React, { FC, ReactText } from 'react';
import styles from "./movie-view-info.module.scss";
import { formatToUSD, getReadableDate, minutesToRuntimeDisplay } from "../../util/utilityFunctions";
import IMovieView from "../../interfaces/app-types/IMovieView";
import { animated, useTransition } from "react-spring";
import { easeOutQuart } from "../../util/easingFuctions";


interface OwnProps {
    movieView: IMovieView
}

type Props = OwnProps;

const MovieViewInfoChildren: FC<Props> = ({movieView: {budget, homepage, release_date, revenue, runtime, status}}) => {
    let hostname = homepage ? (new URL(homepage).hostname) : null;
    let jsx = (
        <>
            <h2 key={1} className={styles.title}>Facts</h2>

            {status ? (<div key={2} className={styles.sideInfoItem}>
                <h4>Status</h4>
                <div>{status}</div>
            </div>) : null}

            {release_date ? (<div key={3} className={styles.sideInfoItem}>
                <h4>Release Date</h4>
                <div>{getReadableDate(release_date)}</div>
            </div>) : null}

            {budget ? (<div key={4} className={styles.sideInfoItem}>
                <h4>Budget</h4>
                <div>{'$' + formatToUSD(budget)}</div>
            </div>) : null}

            {revenue ? (<div key={5} className={styles.sideInfoItem}>
                <h4>Revenue</h4>
                <div>{'$' + formatToUSD(revenue)}</div>
            </div>) : null}

            {homepage ? (<div key={6} className={styles.sideInfoItem}>
                <h4>Homepage</h4>
                <a href={homepage} target="_blank" rel="noopener noreferrer">{hostname}</a>
            </div>) : null}

            {runtime ? (<div key={7} className={styles.sideInfoItem}>
                <h4>Runtime</h4>
                <div>{minutesToRuntimeDisplay(runtime)}</div>
            </div>) : null}
        </>
    );

    const transition = useTransition(
        jsx!.props!.children, item => (item?.key as ReactText), {
            initial: {
                transform: 'translateX(300px)',
                opacity: -1
            },
            enter: {
                transform: 'translateX(0px)',
                opacity: 1,
            },
            config: {
                duration: 1300,
                easing: easeOutQuart
            },
            trail: 105
        });


    return (
        <>
        {transition.map(({props, key, item}) => {
            if(!item) return null;
            // @ts-ignore
            let Element = animated[item.type];
            return <Element key={key} {...item.props} style={props}/>
        })}
        </>
    );
};


export default MovieViewInfoChildren;