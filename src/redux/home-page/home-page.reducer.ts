import { HomePageActions, NowPlayingSectionItems, ThisWeekSectionItems } from "./index";
import { HomePageActionTypes } from "./home-page.actions";
import IMoviesSearchError from "../../interfaces/app-types/IMoviesSearchError";

export interface HomePageState {
    thisWeekSection: SectionState<ThisWeekSectionItems>
	nowPlayingSection: SectionState<NowPlayingSectionItems>
}

interface SectionState<Items extends NowPlayingSectionItems | ThisWeekSectionItems> {
	items: Items | null,
	isLoading: boolean,
	error: IMoviesSearchError | null
}

const INITIAL_STATE: HomePageState = {
    nowPlayingSection: {
    	isLoading: false,
	    items: null,
	    error: null
    },
	thisWeekSection: {
		isLoading: false,
		items: null,
		error: null
	}
};

const homePageReducer = ( state = INITIAL_STATE, action: HomePageActions ): HomePageState => {
	switch (action.type) {
		case HomePageActionTypes.FETCH_THIS_WEEK_START:
			return {
				...state,
				thisWeekSection: {
					...INITIAL_STATE.thisWeekSection,
					isLoading: true,
				}
			};
		case HomePageActionTypes.FETCH_THIS_WEEK_SUCCESS:
			return {
				...state,
				thisWeekSection: {
					items: action.payload,
					isLoading: false,
					error: null
				}
			};
		case HomePageActionTypes.FETCH_THIS_WEEK_FAILURE:
			return {
				...state,
				thisWeekSection: {
					items: null,
					error: action.payload,
					isLoading: false,
				}
			};
		case HomePageActionTypes.FETCH_NOW_PLAYING_START:
			return {
				...state,
				nowPlayingSection: {
					...INITIAL_STATE.thisWeekSection,
					isLoading: true,
				}
			};
		case HomePageActionTypes.FETCH_NOW_PLAYING_SUCCESS:
			return {
				...state,
				nowPlayingSection: {
					items: action.payload,
					isLoading: false,
					error: null
				}
			};
		case HomePageActionTypes.FETCH_NOW_PLAYING_FAILURE:
			return {
				...state,
				nowPlayingSection: {
					items: null,
					error: action.payload,
					isLoading: false,
				}
			};
		default: return state;
	}
};

export default homePageReducer;