import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import {IMovieItemActions, MovieItemActionsTypes} from "../../interfaces/action-types/IMovieItemActions";

export const setMovieItem = (item: IMovieResultItem, domRect: DOMRect): IMovieItemActions => ({
    type: MovieItemActionsTypes.SET_MOVIE_ITEM,
    payload: {item, domRect}
});

export const clearMovieItem = (): IMovieItemActions => ({
    type: MovieItemActionsTypes.CLEAR_MOVIE_ITEM,
});