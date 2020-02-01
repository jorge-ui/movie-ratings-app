import React, {FC} from 'react';
import MovieSearchItem from "../../interfaces/app-types/MovieSearchItem";
import {Card, CardContent, CardMedia} from "@material-ui/core";
import styles from './movie-result-item.module.scss';
import ImageIcon from '@material-ui/icons/Image';
import MovieItemScore from "../movie-item-score/movie-item-score.component";

interface Props {
    movie: MovieSearchItem
}

const MovieResultItem: FC<Props> = ({movie}) => {
    let {poster_path: img_url, title, overview, vote_average} = movie;
    return (
        <Card className={styles.root}>
            {img_url ?
                <CardMedia component={'img'} className={styles.image}
                           image={img_url ? `https://image.tmdb.org/t/p/w300${img_url}` : ''}/>
                : <div className={styles.image}><ImageIcon/></div>
            }
            <CardContent className={styles.content}>
                <div className={styles.wrapper}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.overviewWrap}>
                        <p className={styles.overview}>{overview}</p>
                    </div>
                    <div className={styles.info}>
                        <MovieItemScore score={vote_average}/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default MovieResultItem;