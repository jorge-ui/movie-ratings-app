import React, {FC} from "react";
import MovieSearchItem from "../../interfaces/app-types/MovieSearchItem";
import {Card, CardContent} from "@material-ui/core";
import styles from "./movie-result-item.module.scss";
import ImageIcon from "@material-ui/icons/Image";
import CircledProgressBar from "../circled-progress-bar/circled-progress-bar.component";

interface Props {
  movie: MovieSearchItem;
}

const MovieResultItem: FC<Props> = ({ movie }) => {
  let { poster_path: img_url, title, overview, vote_average } = movie;
  return (
    <Card className={styles.root}>
      <div className={styles.imageWrapper}>
        {img_url ? (
          <div style={{backgroundImage: `url("https://image.tmdb.org/t/p/w300${img_url}")`}} className={styles.image} />
        ) : (
          <div className={styles.image}>
            <ImageIcon />
          </div>
        )}
      </div>
      <CardContent className={styles.content}>
        <div className={styles.wrapper}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.overviewWrap}>
            <p className={styles.overview}>{overview}</p>
          </div>
          <div className={styles.info}>
            <div className={styles.infoWrapper}>
              <CircledProgressBar score={vote_average} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieResultItem;
