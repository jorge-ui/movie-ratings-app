import React, {ReactElement} from "react";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import {Card, CardContent} from "@material-ui/core";
import styles from "./movie-result-item.module.scss";
import ImageIcon from "@material-ui/icons/Image";
import CircledProgressBar from "../circled-progress-bar/circled-progress-bar.component";
import {IMovieItemActions} from "../../interfaces/action-types/IMovieItemActions";
import {bindActionCreators, Dispatch} from "redux";
import {clearMovieItem, setMovieItem} from "../../redux/movie-item/movie-item.actions";
import {connect} from "react-redux";
import MovieItemImgBg from "../movie-item-img-bg/movie-item-img-bg.component";
import appProperties from "../../appProperties";
const {posterSrcPathPrefix} = appProperties;

interface OwnProps {
    movie: IMovieResultItem;
    itemView?: boolean;
    itemViewBg?: ReactElement,
    className?: string;
}

type Props = OwnProps & ReturnType<typeof mapDispatchToProps>

class MovieResultItem extends React.Component<Props> {

    itemRef = React.createRef<HTMLDivElement>();

    shouldComponentUpdate(nextProps: Readonly<Props>) {
        return !!nextProps && (!!nextProps.itemView);
    }

    handleItemClick = (movie: IMovieResultItem) => {
        let domRect = (this.itemRef.current as HTMLDivElement).getBoundingClientRect();
        if (!this.props.itemView)
            this.props.onSetMovieItem(movie, domRect);
        else this.props.onClearMovieItem();
    };

    render() {
        let {movie, className, itemView = false} = this.props;
        let {poster_path, title, vote_average, release_date} = movie;

        let imgSrcPath = `${posterSrcPathPrefix}${poster_path}`;

        return (
            <Card className={`${styles.root} movie-item ${!!className && className}`}
                  ref={this.itemRef} item-view={String(itemView)}>
                <MovieItemImgBg img_path={poster_path} movieId={movie.id} itemView={itemView}/>
                <div className={styles.imageWrapper}>
                    <div style={{backgroundImage: poster_path && `url("${imgSrcPath}")`}}
                         onClick={() => this.handleItemClick(movie)}
                         className={styles.image}>
                        {!poster_path && <ImageIcon className={styles.imageIcon}/>}
                    </div>
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

const mapDispatchToProps = (dispatch: Dispatch<IMovieItemActions>) =>
    bindActionCreators(
        {
            onSetMovieItem: setMovieItem,
            onClearMovieItem: clearMovieItem
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(MovieResultItem);
