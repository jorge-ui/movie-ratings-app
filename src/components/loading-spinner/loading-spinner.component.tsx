import React, { FC, useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./loading-spinner.module.scss";
import useIsMobile from "hooks/useIsMobile";


interface OwnProps {
    className?: string;
    darken?: boolean;
    delay?: number;
    fixed?: boolean;
}


const LoadingSpinner: FC<OwnProps> = ({className, darken = false, delay = 0, fixed = false, ...rest}) => {
    const [visible, setVisible] = useState(delay === 0);

    const isMobile = useIsMobile();

    useEffect(() => {
        let mounted = true;
        if (!visible)
            setTimeout(() => mounted && setVisible(true), delay);
        return () => { mounted = false };
    }, [delay, visible]);

    return (
        <div
            className={`${styles.root} ${className || ''} ${darken ? styles.darken : ''}`} {...rest}
            style={{opacity: visible ? 1 : 0, position: fixed ? "fixed" : "absolute"}}
        >
            <CircularProgress
                size={"15" + (isMobile ? "vw" : "vh")}/>
        </div>
    );
};

export default LoadingSpinner;