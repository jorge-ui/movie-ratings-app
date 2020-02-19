import React, {FC, RefObject, useRef} from "react";
import styles from "./circled-progress-bar.module.scss";
import {hslInterval, hslToHex, isMobile} from "../../util/utilityFunctions";
import {animated, useSpring} from 'react-spring';
import {easeOutQuad} from "../../util/easingFuctions";

interface OwnProps {
    score: number;
}

type Props = OwnProps;

const viewBoxSize = 60;
const strokeWidth = viewBoxSize / 15;
const circleRadius = viewBoxSize / 2 - strokeWidth;
const circleCircumference = circleRadius * 2 * Math.PI;

// (min & max) colors MUST be in hsl
const minScoreColor: [number, number, number] = [1, 81, 40];
const maxScoreColor: [number, number, number] = [117, 88, 67];
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
    const strokeDashOffsetVal = circleCircumference - progressValue;

    const props = useSpring({
        stroke: hslToHex(progressColor),
        strokeDashoffset: strokeDashOffsetVal,
        from: {
            stroke: hslToHex(minScoreColor),
            strokeDashoffset: circleCircumference,
        },
        config: {
            duration: 3000 * progressMultiplier,
            easing: easeOutQuad
        },
        delay: 450
    });

    return (
        <div className={styles.root} {...rest}>
            <svg height="100%" width={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                          overflow={"visible"} >
                <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={circleRadius}
                    fill={backFill}
                    stroke={backStroke}
                    strokeWidth={strokeWidth}
                    style={{zIndex: -1}}
                />
                <animated.circle
                    style={!isMobile() ? props : undefined}
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={circleRadius}
                    stroke={hslToHex(progressColor)}
                    ref={progressRef}
                    fill={"none"}
                    strokeDasharray={circleCircumference}
                    strokeLinecap={"round"}
                    strokeDashoffset={strokeDashOffsetVal.toString()}
                    strokeWidth={strokeWidth}
                    strokeMiterlimit={viewBoxSize / 10}
                    transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`}
                />
            </svg>
            <span className={styles.scoreValue}>{score ? score.toPrecision(2) : 'NR'}</span>
        </div>
    );
};

export default CircledProgressBar;
