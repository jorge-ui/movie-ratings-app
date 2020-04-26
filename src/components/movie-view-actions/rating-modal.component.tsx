import React, { FC, useState } from "react";
import Rating from "@material-ui/lab/Rating";
import styles from "./movie-view-actions.module.scss";
import useIsMobile from "hooks/useIsMobile";
import useLockBodyScroll from "hooks/useLockBodyScroll";


interface Props {
    rateItem: (newValue: number | null) => void;
    defaultValue?: number;
    setRatingModal: (state: boolean) => void
}

const valuesMap = {
    0  : 0.0,
    1  : 0.5,
    2  : 1.0,
    3  : 1.5,
    4  : 2.0,
    5  : 2.5,
    6  : 3.0,
    7  : 3.5,
    8  : 4.0,
    9  : 4.5,
    10 : 5.0
}

const RatingModal: FC<Props> = ({rateItem, defaultValue = 0, setRatingModal}) => {
    const isMobile = useIsMobile();
    const [value, setValue] = useState<number | null>(defaultValue/2);

    useLockBodyScroll(600);

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
    function onTouch(e: React.TouchEvent<HTMLSpanElement>) {
        const {left, right} = e.currentTarget.getBoundingClientRect();
        const maxPoint = right - left;
        const touchPoint = e.targetTouches[0].clientX - left;
        const pointPercent = Math.round((touchPoint / maxPoint)*100);
        const resultPercent =
            pointPercent > 0 ? (pointPercent <= 100 ? pointPercent : 100) : 0

        const newValue = valuesMap[Math.round(resultPercent / 10) as keyof typeof valuesMap];
        setValue(newValue);
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
                            return;
                        else rateItem((newValue || 0) * 2);
                    }}
                    onTouchMove={onTouch}
                    onTouchStart={onTouch}
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