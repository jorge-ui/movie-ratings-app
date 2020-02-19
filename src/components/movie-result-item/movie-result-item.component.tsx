import React from "react";
import MovieSearchItem from "../../interfaces/app-types/MovieSearchItem";
import {Card, CardContent} from "@material-ui/core";
import styles from "./movie-result-item.module.scss";
import ImageIcon from "@material-ui/icons/Image";
import CircledProgressBar from "../circled-progress-bar/circled-progress-bar.component";
import {isMobile} from "../../util/utilityFunctions";

const {REACT_APP_API_KEY} = process.env;

interface Props {
    movie: MovieSearchItem;
}

class MovieResultItem extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        let {movie} = this.props;
        let {poster_path: img_url, title, vote_average, release_date} = movie;

        return (
            <Card className={`${styles.root} movie-item`}>
                {!isMobile() && img_url &&
                <img src={`https://image.tmdb.org/t/p/w300${img_url}`} className={styles.backImage}
                     alt={'movie-poster'}/>}
                <div className={styles.imageWrapper}>
                    <a href={`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${REACT_APP_API_KEY}`}
                       style={{backgroundImage: img_url && `url("https://image.tmdb.org/t/p/w300${img_url}")`}}
                       className={styles.image}>
                        {!img_url && <ImageIcon className={styles.imageIcon}/>}
                    </a>
                </div>
                <CardContent className={styles.content}>
                    <div className={styles.wrapper}>
                        <div className={styles.header}>
                            <div className={styles.title}>{title}</div>
                            {release_date && <div className={styles.year}>{release_date.substr(0, 4)}</div>}
                        </div>
                        <div className={styles.info}>
                            <div className={styles.infoWrapper}>
                                <CircledProgressBar score={vote_average}/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export default MovieResultItem;
