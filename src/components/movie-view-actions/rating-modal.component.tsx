import React, { FC, useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import styles from './movie-view-actions.module.scss';
import { Fade } from "@material-ui/core";


interface Props {
    rateItem: (newValue: number | null) => void;
    defaultValue?: number;
}

const RatingModal: FC<Props> = ({rateItem, defaultValue}) => {
    const [value] = useState((defaultValue || 0)/2);
    const unRate = () => rateItem(null);
    return (
        <div className={styles.ratingModal}>
            {!!value && <button onClick={unRate} title="remove rating">-</button>}
            <Fade appear timeout={300} in>
                <Rating
                    name="movie-rating"
                    precision={0.5}
                    value={value}
                    onChange={(event, newValue) => {
                        rateItem((newValue || 0)*2);
                    }}
                />
            </Fade>
        </div>
    );
};


export default RatingModal;