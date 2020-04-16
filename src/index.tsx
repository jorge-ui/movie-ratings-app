import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import { StylesProvider } from '@material-ui/core/styles';
import { onWorkerFetchedDoneEvent } from "./util/utilityFunctions";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./myWebWorker";

window.apiNowFetchingPages = new Set<number>();
window.sessionColorsNowFetching = new Set<number>();
window.worker = new Worker();
window.worker.onmessage = onWorkerFetchedDoneEvent;

renderApp(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function renderApp(App: FC) {
    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                <StylesProvider injectFirst>
                    <App />
                </StylesProvider>
            </HashRouter>
        </Provider>,
        document.getElementById('root')
    );
}
