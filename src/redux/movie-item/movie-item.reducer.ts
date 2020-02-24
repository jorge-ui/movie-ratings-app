import {IMovieItemActions, MovieItemActionsTypes} from "../../interfaces/action-types/IMovieItemActions";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";

export interface MovieItemState {
    item: IMovieResultItem | null,
    domRect: DOMRect | null
}

const INITIAL_STATE: MovieItemState = {
    item: null,
    domRect: null
};

const movieItemReducer = ( state = INITIAL_STATE, action: IMovieItemActions ): MovieItemState => {
    switch (action.type) {
        case MovieItemActionsTypes.SET_MOVIE_ITEM:
            return {
                ...state,
                item: action.payload.item,
                domRect: action.payload.domRect
            };
        case MovieItemActionsTypes.CLEAR_MOVIE_ITEM:
            return {
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};

export default movieItemReducer;