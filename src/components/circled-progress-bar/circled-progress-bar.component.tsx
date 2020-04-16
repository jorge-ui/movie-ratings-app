import React, { CSSProperties, FC, RefObject, useEffect, useRef } from "react";
import styles from "./circled-progress-bar.module.scss";
import { hslInterval, hslToHex } from "../../util/utilityFunctions";
import { animated, useSpring } from 'react-spring';
import { easeOutQuad } from "../../util/easingFuctions";
import useIsMobile from "../../util/custom-hooks/useIsMobile";

interface OwnProps {
    score: number;
    itemView: boolean;
    className?: string;
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

const RatingProgressBar: FC<Props> = ({score, itemView = false, className, ...rest}) => {
    const rootRef: RefObject<HTMLDivElement> = useRef(null);
    const progressMultiplier = score / 10;

    const isMobile = useIsMobile();

    const progressColor = hslInterval(
        minScoreColor,
        maxScoreColor,
        progressMultiplier
    );

    const progressValue = circleCircumference * progressMultiplier;
    const strokeDashOffsetVal = circleCircumference - progressValue;

    const [props, set] = useSpring(() => ({
        stroke: hslToHex(!itemView ? minScoreColor : progressColor),
        strokeDashoffset: !itemView ? circleCircumference : strokeDashOffsetVal,
        config: {
            duration: 3000 * progressMultiplier,
            easing: easeOutQuad
        },
    }));

    useEffect(onComponentMount, []);

    const style: CSSProperties = {
        visibility: !itemView ? "hidden" : undefined,
        opacity: !itemView ? 0 : 1
    };

    return (
            <div className={`${styles.root} ${className ? className : ''}`} {...rest} style={style} ref={rootRef}>
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
                    <animated.circle
                        style={!isMobile ? props : undefined}
                        cx={viewBoxSize / 2}
                        cy={viewBoxSize / 2}
                        r={circleRadius}
                        stroke={hslToHex(progressColor)}
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

    function onComponentMount() {
        let ignore = false;
        setTimeout(() => {
            if (ignore) return;
            if (!itemView) {
                rootRef.current!.style.visibility = "visible";
                rootRef.current!.style.opacity = "1";
                animateProgress()
            }
        } ,400);
        return () => void (ignore = true);
    }

    function animateProgress() {
        set({
            stroke: hslToHex(progressColor),
            strokeDashoffset: strokeDashOffsetVal
        });
    }
};

export default RatingProgressBar;
