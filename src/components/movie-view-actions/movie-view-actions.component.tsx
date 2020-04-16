import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import styles from './movie-view-actions.module.scss';
import { Tooltip } from "@material-ui/core";
import IMovieUserState, { Rated } from "../../interfaces/app-types/IMovieUserState";
import useAuth from "../../util/custom-hooks/useAuth";
import { goFetch } from "../../util/utilityFunctions";
import appProperties from "../../appProperties";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import GradeIcon from "@material-ui/icons/Grade";
import RatingModal from "./rating-modal.component";

const {buildFetchMovieViewUrl, itemActions} = appProperties;

interface Props {
    movieId: number
}
type State = IMovieUserState & {isLoading: Array<keyof IMovieUserState>}

type ReducerActions =
    | { type: 'set-account-state', payload: IMovieUserState }
    | { type: 'update-favorite',   payload: boolean }
    | { type: 'update-watchlist',  payload: boolean }
    | { type: 'update-rated',      payload: boolean | Rated }
    | { type: 'set-is-loading',    payload: Array<keyof IMovieUserState> }
    | { type: 'clear-loading' };

function reducer(state: State, action: ReducerActions): State {
    switch (action.type) {
        case "set-account-state":
            return {
                ...action.payload,
                isLoading: []
            }
        case "update-favorite":
            return {
                ...state,
                favorite: action.payload,
                isLoading: state.isLoading.filter(value => value !== "favorite")
            }
        case "update-watchlist":
            return {
                ...state,
                watchlist: action.payload,
                isLoading: state.isLoading.filter(value => value !== "watchlist")
            }
        case "update-rated":
            return {
                ...state,
                rated: action.payload,
                isLoading: state.isLoading.filter(value => value !== "rated")
            }
        case "set-is-loading":
            return {
                ...state,
                isLoading: [...new Set(
                    [...state.isLoading, ...action.payload]
                )]
            }
        case "clear-loading":
            return {
                ...state,
                isLoading: []
            }
        default: return state;
    }
}

const initial_state: State = {
    rated: false,
    watchlist: false,
    favorite: false,
    isLoading: [],
    id: 0
}

const MovieViewActionButtons: FC<Props> = ({movieId}) => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false }
    }, []);

    const [ratingModal, setRatingModal] = useState(false);


    const [state, dispatch] = useReducer(reducer, initial_state);
    const setLoading = (actionName: keyof IMovieUserState) => dispatch({type: 'set-is-loading', payload: [actionName]});

    const auth = useAuth();
    const ratedValue = typeof state.rated === "object" ? state.rated.value : undefined;

    const ignoreActions = !auth.isAuth || !state.id;

    useEffect(() => {
        let ignore = false;
        if (auth.isAuth && !state.id) {
            dispatch({type: 'set-is-loading', payload: ['id']});
            goFetch<IMovieUserState>
            (`${buildFetchMovieViewUrl(movieId, "/account_states")}&session_id=${localStorage.getItem("session_id")}`)
                .then(data => {
                    !ignore && dispatch({type: 'set-account-state', payload: data});
                });
        }

        return () => void (ignore = true)
    }, [state.id, auth.isAuth, movieId]);

    const markFavorite = () => {
        if (ignoreActions) return;
        let newVal = !state.favorite;
        setLoading('favorite');
        itemActions.favorite(newVal, movieId)
            .then(() => {
                isMounted.current && dispatch({
                    type: 'update-favorite', payload: newVal
                });
            })
            .catch(e => {
                console.log(e);
                alert("Error: could not mark to favorites :(")
                isMounted.current && dispatch({type: 'clear-loading'});
            })
    }

    const markWatchlist = () => {
        if (ignoreActions) return;
        let newVal = !state.watchlist;
        setLoading('watchlist');
        itemActions.watchlist(newVal, movieId)
            .then(() => {
                isMounted.current && dispatch({
                    type: 'update-watchlist', payload: newVal
                });
            })
            .catch(e => {
                console.log(e);
                alert("Error: could not update watchlist :(")
                isMounted.current && dispatch({type: 'clear-loading'});
            })
    }

    const rateItem = (newVal: number | null) => {
        if (ignoreActions) return;
        if ((typeof state.rated === "object" && newVal === state.rated.value)
            || (newVal === null && state.rated === false)
        )
            return setRatingModal(false);

        setLoading("rated");
        setRatingModal(false);
        if (newVal)
            itemActions.rate(newVal, movieId)
                .then(() => {
                    isMounted.current && dispatch({
                        type: 'update-rated', payload: {value: newVal}
                    });
                })
                .catch(e => {
                    console.log(e);
                    alert("Error: could not update rating :(")
                    isMounted.current && dispatch({type: 'clear-loading'});
                })
        else itemActions.unRate(movieId)
            .then(() => {
                isMounted.current && dispatch({
                    type: 'update-rated', payload: false
                });
            })
            .catch(e => {
                console.log(e);
                alert("Error: could not update rating :(")
                isMounted.current && dispatch({type: 'clear-loading'});
            })
    }


    return (
        <ul className={styles.root}>
            <Tooltip key={"favorite"} title={"Mark as Favorite"} enterDelay={300}
                     PopperProps={{className: styles.toolTip}}>
                <div className={styles.iconWrapper}
                     active-icon={String(!!state.favorite)}
                     action-name={"favorite"}
                     is-loading={String(state.isLoading.includes("favorite"))}
                     onClick={markFavorite}
                >
                    <FavoriteIcon className={styles.icon} />
                </div>
            </Tooltip>
            <Tooltip key={"watchlist"} title={"Add to your watchlist"} enterDelay={300}
                     PopperProps={{className: styles.toolTip}}>
                <div className={styles.iconWrapper}
                     active-icon={String(!!state.watchlist)}
                     action-name={"watchlist"}
                     is-loading={String(state.isLoading.includes("watchlist"))}
                     onClick={markWatchlist}
                >
                    <BookmarkIcon className={styles.icon} />
                </div>
            </Tooltip>
            <Tooltip key={"rated"} title={"Rate it!"} enterDelay={300}
                     PopperProps={{className: styles.toolTip}}>
                <div className={styles.iconWrapper}
                     active-icon={String(!!state.rated)}
                     action-name={"rated"}
                     is-loading={String(state.isLoading.includes("rated"))}
                     onClick={() => setRatingModal(prev => !prev)}
                     {...(!!state.rated ?
                         {"icon-score": (state.rated as Rated).value} : {})}
                >
                    <GradeIcon className={styles.icon} />
                </div>
            </Tooltip>
            {ratingModal && <RatingModal rateItem={rateItem} defaultValue={ratedValue}/>}
        </ul>
    );
};



export default MovieViewActionButtons;
