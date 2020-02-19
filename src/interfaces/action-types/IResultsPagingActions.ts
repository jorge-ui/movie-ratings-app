import IReduxBaseAction from "./IReduxBaseAction";
import MovieSearchItem from "../app-types/MovieSearchItem";

export enum ResultsPagingActionTypes {
    GO_TO_NEXT_RESULTS_PAGE = "GO_TO_NEXT_RESULTS_PAGE",
    GO_TO_PREVIOUS_RESULTS_PAGE = "GO_TO_PREVIOUS_RESULTS_PAGE",
    SET_PAGING_PORTION = "SET_PAGING_PORTION",
    INIT_PAGING = "INIT_PAGING",
    RESET_PAGING = "RESET_PAGING"
}

interface GoToNextResultsPage extends IReduxBaseAction {
    type: typeof ResultsPagingActionTypes.GO_TO_NEXT_RESULTS_PAGE;
}

interface GoToPreviousResultsPage extends IReduxBaseAction {
    type: typeof ResultsPagingActionTypes.GO_TO_PREVIOUS_RESULTS_PAGE;
}

interface SetPagingPortion extends IReduxBaseAction {
    type: typeof ResultsPagingActionTypes.SET_PAGING_PORTION,
    payload: { resultsPortion: (MovieSearchItem | undefined)[], page: number }
}

interface InitPagingPortion extends IReduxBaseAction {
    type: typeof ResultsPagingActionTypes.INIT_PAGING,
    payload: { total_results: number, totalPaging: number }
}

interface ResetPaging extends IReduxBaseAction {
    type: typeof ResultsPagingActionTypes.RESET_PAGING
}

export type IResultsPagingActions =
    | GoToNextResultsPage
    | GoToPreviousResultsPage
    | SetPagingPortion
    | ResetPaging
    | InitPagingPortion