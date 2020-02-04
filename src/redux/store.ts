import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer, {AppState} from './root-reducer';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {AppActions} from "../interfaces/action-types/AppActions";

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

const storeEnhancer = [];

if (process.env.NODE_ENV === 'development' && window.innerWidth > 576)
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
