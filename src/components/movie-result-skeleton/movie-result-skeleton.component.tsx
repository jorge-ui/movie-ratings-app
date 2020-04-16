import React, { FC } from 'react';
import styles from './movie-result-skeleton.module.scss';

interface OwnProps {
}

type Props = OwnProps;

const viewBoxSize = 60;
const strokeWidth = viewBoxSize / 15;
const circleRadius = viewBoxSize / 2 - strokeWidth;

const backFill = "rgba(0, 0, 0, .25)";
const backStroke = "#5d5d5d";

const MovieResultSkeleton: FC<Props> = () => (
    <div className={`${styles.root}`}>
        <div className={styles.imageWrapper}>
            <div className={styles.image}/>
        </div>
        <div className={styles.content}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}/>
                    <div className={styles.year}/>
                </div>
                <div className={styles.info}>
                    <div className={styles.infoWrapper}>
                        <svg height="100%" width={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                             overflow={"visible"}>
                            <circle
                                cx={viewBoxSize / 2}
                                cy={viewBoxSize / 2}
                                r={circleRadius}
                                fill={backFill}
                                stroke={backStroke}
                                strokeWidth={strokeWidth}
                                style={{zIndex: -1}}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export default MovieResultSkeleton;