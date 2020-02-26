import IMovieResultItem from "../app-types/IMovieResultItem";
import {AnyAction as ReduxAnyAction} from "redux";

export enum MovieItemActionsTypes {
    SET_MOVIE_ITEM= 'SET_MOVIE_ITEM',
    CLEAR_MOVIE_ITEM = 'CLEAR_MOVIE_ITEM'
}

interface setMovieItem extends ReduxAnyAction {
    type: typeof MovieItemActionsTypes.SET_MOVIE_ITEM,
    payload: {item: IMovieResultItem, domRect: DOMRect}
}

interface clearMovieItem extends ReduxAnyAction {
    type: typeof MovieItemActionsTypes.CLEAR_MOVIE_ITEM,
}

export type IMovieItemActions =
    | setMovieItem
    | clearMovieItem