import React, { FC, useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import styles from './movie-view-actions.module.scss';
import useIsMobile from "../../util/custom-hooks/useIsMobile";
import useLockBodyScroll from "../../util/custom-hooks/useLockBodyScroll";


interface Props {
    rateItem: (newValue: number | null) => void;
    defaultValue?: number;
    setRatingModal: (state: boolean) => void
}

const RatingModal: FC<Props> = ({rateItem, defaultValue = 0, setRatingModal}) => {
    const isMobile = useIsMobile();
    const [value, setValue] = useState<number | null>(defaultValue/2);
    useLockBodyScroll();
    const unRate = () => {
        if (isMobile)
            setValue(null)
        else rateItem(null);
    }
    const handleClickAway = (e: React.MouseEvent) => {
        const screenYPercent = e.clientY / window.innerHeight;
        if (screenYPercent < .55)
            setRatingModal(false);
    }
    return (
        <div className={styles.ratingModalContainer} onClick={handleClickAway} >
            <div className={styles.ratingModal}>
                {!!defaultValue &&
                <button onClick={unRate} title="remove rating" className={styles.removeButton}>-</button>
                }
                <Rating
                    name="movie-rating"
                    precision={0.5}
                    value={value}
                    onChange={(event, newValue) => {
                        if (isMobile)
                            return setValue(newValue || 0);
                        else rateItem((newValue || 0) * 2);
                    }}
                    size={isMobile ? "large" : "medium"}
                />
                {isMobile && <button
                    disabled={(defaultValue/2) === value}
                    className={styles.mobileSubmit}
                    onClick={() => {
                        rateItem(value ? value*2 : value)
                    }}
                >{value === null ? "Un-Rate" : "Rate"}</button>
                }
            </div>
        </div>
    );
};


export default RatingModal;