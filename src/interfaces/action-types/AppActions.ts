import { IMoviesActions } from "./IMoviesActions";
import { IResultsPagingActions } from "./IResultsPagingActions";

export type AppActions = IMoviesActions | IResultsPagingActions;
