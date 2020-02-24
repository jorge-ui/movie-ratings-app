import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer, {AppState} from './root-reducer';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {AppActions} from "../interfaces/action-types/AppActions";
import {isMobile} from "../util/utilityFunctions";

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

const storeEnhancer: never[] = [];

if (process.env.NODE_ENV === 'development' && !isMobile())
    storeEnhancer.push(
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      );

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    ...storeEnhancer
  )
);
