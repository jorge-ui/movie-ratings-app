import React, {FC} from 'react';
import styles from './total-search-results.module.scss';

interface OwnProps {
    totalResults: number
}

const TotalSearchResults: FC<OwnProps> = ({totalResults}) => (
    <div className={styles.root}>Total movies found: {totalResults}</div>
);

export default TotalSearchResults;