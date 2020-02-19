import React, {FC} from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from './loading-spinner.module.scss';
import {isMobile} from "../../util/utilityFunctions";


interface OwnProps {
    className?: string
}

type Props = OwnProps;

const LoadingSpinner: FC<Props> = ({className, ...rest}) =>
    <div className={styles.root + " " + className} {...rest}>
        <CircularProgress
            size={"15" + (isMobile() ? "vw" : "vh")}/>
    </div>;

export default LoadingSpinner;