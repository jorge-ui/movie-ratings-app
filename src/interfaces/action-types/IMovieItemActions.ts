import IReduxBaseAction from "./IReduxBaseAction";
import IMovieResultItem from "../app-types/IMovieResultItem";

export enum MovieItemActionsTypes {
    SET_MOVIE_ITEM= 'SET_MOVIE_ITEM',
    CLEAR_MOVIE_ITEM = 'CLEAR_MOVIE_ITEM'
}

interface setMovieItem extends IReduxBaseAction {
    type: typeof MovieItemActionsTypes.SET_MOVIE_ITEM,
    payload: {item: IMovieResultItem, domRect: DOMRect}
}

interface clearMovieItem extends IReduxBaseAction {
    type: typeof MovieItemActionsTypes.CLEAR_MOVIE_ITEM,
}

export type IMovieItemActions =
    | setMovieItem
    | clearMovieItem