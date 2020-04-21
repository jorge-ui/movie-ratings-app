import React, { FC } from 'react';
import styles from './total-search-results.module.scss';
import { formatToUSD } from "../../util/utilityFunctions";

interface OwnProps {
    totalResults: number
}

const TotalSearchResults: FC<OwnProps> = ({totalResults}) => (
    <div className={styles.root}>
        Found: {formatToUSD(totalResults)}{totalResults === 10_000 && "+"}
    </div>
);

export default TotalSearchResults;