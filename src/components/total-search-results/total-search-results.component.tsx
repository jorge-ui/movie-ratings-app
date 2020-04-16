import React, { FC } from 'react';
import styles from './total-search-results.module.scss';

interface OwnProps {
    totalResults: number
}

const TotalSearchResults: FC<OwnProps> = ({totalResults}) => (
    <div className={styles.root}>Found: {totalResults}</div>
);

export default TotalSearchResults;