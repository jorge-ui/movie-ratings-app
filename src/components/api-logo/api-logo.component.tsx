import React, { FC } from 'react';
import { ReactComponent as Logo } from "./logo.svg";
import styles from "./api-logo.module.scss";

const ApiLogo: FC = () =>
    <div className={styles.root}>
        Made with <a href={"https://www.themoviedb.org/"} target="_blank" rel="noopener noreferrer"><Logo title="themoviedb.org"/></a> API
    </div>


export default ApiLogo;