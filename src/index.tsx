import React, {FC} from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StylesProvider } from '@material-ui/core/styles';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: (()=>void) | undefined;
        apiNowFetchingPages: Set<number>,
    }
}
window.apiNowFetchingPages = new Set<number>();


const rootPath =
    process.env.NODE_ENV === 'development' ? '/' : '/movie-ratings-app/';

const renderApp = (App: FC) => ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename={rootPath}>
            <StylesProvider injectFirst>
                <App />
            </StylesProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

renderApp(App);


// @ts-ignore (this enables hot reloading)
if (process.env.NODE_ENV === 'development') module.hot && module.hot.accept(['./App','./pages/search-page/search-page.component'], () => {
    // @ts-ignore
    let movieView: HTMLDivElement | undefined = document.querySelector('.MuiContainer-root').firstElementChild.childNodes[2];

    if (!movieView)
        renderApp(require('./App').default);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


