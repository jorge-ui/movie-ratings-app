import React, {FC} from 'react';
import styles from './movie-item-score.module.scss';
import CircularProgress from "@material-ui/core/CircularProgress";

interface OwnProps {
    score: number
}

type Props = OwnProps;

const MovieItemScore: FC<Props> = ({score, ...rest}) => {
    return (
        <div className={styles.root} {...rest}>
            <CircularProgress variant="static" value={score*10} className={styles.progress}/>
            <span className={styles.score}>{score.toPrecision(2)}</span>
        </div>
    );
};


export default MovieItemScore;