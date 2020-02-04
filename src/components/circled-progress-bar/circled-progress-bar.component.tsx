import React, { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./circled-progress-bar.module.scss";
import ProgressBar from "progressbar.js";

interface OwnProps {
  score: number;
}

type Props = OwnProps;

const CircledProgressBar: FC<Props> = ({ score, ...rest }) => {
  const rootRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const progressRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const progressMultiplier = score / 10;

  let [circleRadiusPx, setCircleSizePx] = useState(0);

  useEffect(() => {
    function getBoundingClientSize() {
      let clientRect = rootRef.current?.getBoundingClientRect();
      if (clientRect) {
        let circleRadius = clientRect.height / 2;
        setCircleSizePx(circleRadius);
      }
    }
    getBoundingClientSize();
    window.addEventListener("resize", getBoundingClientSize);

    const progressPath = new ProgressBar.Circle(progressRef.current, {
      trailColor: "#546b7a",
      trailWidth: 6,
      strokeWidth: 6,
      duration: 1700,
      easing: "easeOut",
      from: { color: "#ED6A5A", a: 0, width: 6  },
      to:   { color: "#5ded59", a: 1, width: 10 },
      step: ( state: { width: number; color: any, a: number }, circle: { path: SVGPathElement; trail: SVGPathElement } ) => {
        if(state.a <= progressMultiplier) circle.path.setAttribute("stroke", state.color);
        circle.path.setAttribute("stroke-width", state.width.toString());
        circle.trail.setAttribute("stroke-width", state.width.toString());
      }
    });
    progressPath.animate(progressMultiplier);

    return () => window.removeEventListener("resize", getBoundingClientSize);
  }, [progressMultiplier]);

  return (
    <div ref={rootRef} className={styles.root} {...rest} style={{ width: circleRadiusPx * 2 }}>
      <div ref={progressRef} />
      <span style={{ position: "absolute" }}>{score.toPrecision(2)}</span>
    </div>
  );
};

export default CircledProgressBar;
