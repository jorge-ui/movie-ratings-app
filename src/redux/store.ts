import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from './root-reducer';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { AppActions, AppState } from "./";

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

const storeEnhancer: any[] = [];

if (process.env.NODE_ENV === 'development')
    window.__REDUX_DEVTOOLS_EXTENSION__ && storeEnhancer.push(
        window.__REDUX_DEVTOOLS_EXTENSION__()
      );

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    ...storeEnhancer
  )
);

export default store;