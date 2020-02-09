import React, {FC, RefObject, useEffect, useRef} from "react";
import styles from "./circled-progress-bar.module.scss";
import {TweenMax} from "gsap";
import {hslInterval, isMobile} from "../../util/utilityFunctions";

interface OwnProps {
    score: number;
}

type Props = OwnProps;

const viewBoxSize = 60;
const strokeWidth = viewBoxSize / 15;
const circleRadius = viewBoxSize / 2 - strokeWidth;
const circleCircumference = circleRadius * 2 * Math.PI;

// (min & max) colors MUST be in hsl
const minScoreColor = "hsl(1,81%,40%)";
const maxScoreColor = "hsl(117,88%,67%)";
const backFill = "rgba(0, 0, 0, .25)";
const backStroke = "#5d5d5d";

const CircledProgressBar: FC<Props> = ({score, ...rest}) => {
    const progressRef: RefObject<SVGCircleElement> = useRef(null);
    const progressMultiplier = score / 10;
    const progressColor = hslInterval(
        minScoreColor,
        maxScoreColor,
        progressMultiplier
    );

    const progressValue = circleCircumference * progressMultiplier;

    useEffect(() => {
        if (progressMultiplier > 0 && !isMobile())
            TweenMax.from(progressRef.current, 3, {
                stroke: minScoreColor,
                strokeDashoffset: circleCircumference,
                ease: "power3.out",
            });
    }, [progressMultiplier]);

    return (
        <div className={styles.root} {...rest}>
            <svg height="100%" width={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} overflow={"visible"} >
                <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={circleRadius}
                    fill={backFill}
                    stroke={backStroke}
                    strokeWidth={strokeWidth}
                    style={{zIndex: -1}}
                />
                <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={circleRadius}
                    stroke={progressColor}
                    ref={progressRef}
                    fill={"none"}
                    strokeDasharray={circleCircumference}
                    strokeLinecap={"round"}
                    strokeDashoffset={circleCircumference - progressValue}
                    strokeWidth={strokeWidth}
                    strokeMiterlimit={viewBoxSize / 10}
                    transform={`rotate(-90 ${viewBoxSize/2} ${viewBoxSize/2})`}
                />
            </svg>
            <span className={styles.scoreValue}>{score ? score.toPrecision(2) : 'NR'}</span>
        </div>
    );
};

export default CircledProgressBar;
