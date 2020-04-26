import React from "react";
import ReactDOM from "react-dom";
import './styles/index.scss';
import * as serviceWorker from "./serviceWorker";
import 'typeface-roboto';
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "store";
import { StylesProvider } from "@material-ui/core/styles";
import { onWorkerFetchedDoneEvent } from "utility";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./myWebWorker";

window.worker = new Worker();
window.worker.onmessage = onWorkerFetchedDoneEvent;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



const render = () => {
    const App = require('./App').default

    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                <StylesProvider injectFirst>
                    <App />
                </StylesProvider>
            </HashRouter>
        </Provider>,
        document.getElementById('root')
    )
}

render();

// @ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) module.hot.accept('./App', render);
