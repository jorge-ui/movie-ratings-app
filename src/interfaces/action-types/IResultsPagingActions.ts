import IMovieResultItem from "../app-types/IMovieResultItem";
import {AnyAction as ReduxAnyAction} from "redux";

export enum ResultsPagingActionTypes {
    GO_TO_NEXT_RESULTS_PAGE = "GO_TO_NEXT_RESULTS_PAGE",
    GO_TO_PREVIOUS_RESULTS_PAGE = "GO_TO_PREVIOUS_RESULTS_PAGE",
    SET_PAGING_PORTION = "SET_PAGING_PORTION",
    INIT_PAGING = "INIT_PAGING",
    RESET_PAGING = "RESET_PAGING"
}

interface GoToNextResultsPage extends ReduxAnyAction {
    type: typeof ResultsPagingActionTypes.GO_TO_NEXT_RESULTS_PAGE;
}

interface GoToPreviousResultsPage extends ReduxAnyAction {
    type: typeof ResultsPagingActionTypes.GO_TO_PREVIOUS_RESULTS_PAGE;
}

interface SetPagingPortion extends ReduxAnyAction {
    type: typeof ResultsPagingActionTypes.SET_PAGING_PORTION,
    payload: { resultsPortion: (IMovieResultItem | undefined)[], page: number }
}

interface InitPagingPortion extends ReduxAnyAction {
    type: typeof ResultsPagingActionTypes.INIT_PAGING,
    payload: { total_results: number, totalPaging: number }
}

interface ResetPaging extends ReduxAnyAction {
    type: typeof ResultsPagingActionTypes.RESET_PAGING
}


export type IResultsPagingActions =
    | GoToNextResultsPage
    | GoToPreviousResultsPage
    | SetPagingPortion
    | ResetPaging
    | InitPagingPortion