import { IMovieViewActions } from "./index";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import { MovieViewActionsTypes } from './movie-view.actions';
import { setSearchParam } from "../../util/utilityFunctions";

export interface MovieItemState {
	item: IMovieResultItem | null,
}

const INITIAL_STATE: MovieItemState = {
	item: null,
};

const movieViewReducer = (state = INITIAL_STATE, action: IMovieViewActions): MovieItemState => {
	switch (action.type) {
		case MovieViewActionsTypes.SET_MOVIE_VIEW:
			setSearchParam("movieId", action.payload.id);
			return {
				...state,
				item: action.payload,
			};
		case MovieViewActionsTypes.CLEAR_MOVIE_VIEW:
			return {
				...INITIAL_STATE
			};
		default:
			return state;
	}
};

export default movieViewReducer;