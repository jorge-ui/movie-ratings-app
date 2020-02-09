import React, {FC} from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from './loading-spinner.module.scss';


interface OwnProps {
    className?: string
}

type Props = OwnProps;

const LoadingSpinner: FC<Props> = ({className, ...rest}) => {
    return <CircularProgress className={styles.circularProgress + " " + className} {...rest}/>;
};

export default LoadingSpinner;