import React, {FC} from 'react';
import MoviesSearchError from "../../interfaces/app-types/MoviesSearchError";
import styles from './error-message.module.scss';


interface OwnProps {
    error: MoviesSearchError,
    className?: string
}

type Props = OwnProps;

const ErrorMessage: FC<Props> = ({className, error}) => {
    return (
        <div className={`${className ? className : ''} ${styles.root}`}>
            <div className={styles.title}>- Search error -</div>
            {error.errors.map((message, index) =>
                <div key={index}>"{message}"</div>
            )}
        </div>
    );
};


export default ErrorMessage;