import { easeOutQuad } from "./utility/easingFuctions";
import { MoviesBrowseNames } from "store/movies-browser";

const {REACT_APP_API_KEY: API_KEY, NODE_ENV} = process.env;
const BASE_API_URL = 'https://api.themoviedb.org/3'

type ImageSizes = "200" | "300" | "400" | "500";

const REDIRECT_LOGGING = NODE_ENV === 'development' ?
    'http://192.168.1.4:3000/' : 'https://jorge-ui.tech/movie-ratings-app';

const getApiKeyQuery = () => `api_key=${API_KEY}`;
const getSessionQuery = () => `session_id=${localStorage.getItem("session_id")}`;

const appProperties = {
    //application properties here
    itemsPerPageUI: 9,

    getPosterSrcPathPrefix: (size: ImageSizes = "200") =>  `https://image.tmdb.org/t/p/w${size}`,

    buildFetchMovieSearchUrl: (searchTerm: string, page: number = 1) =>
        `${BASE_API_URL}/search/movie?${getApiKeyQuery()}&query=${searchTerm}&page=${page}&include_adult=false`,

    buildFetchMovieViewUrl: (movieId: number, addPath?: string) => {
        return `${BASE_API_URL}/movie/${movieId}${addPath || ''}?${getApiKeyQuery()}`;
    },

    searchPageTransitionConfig: {
        duration: 400,
        easing: easeOutQuad,
    },

    newSessionUrl: `${BASE_API_URL}/authentication/session/new?${getApiKeyQuery()}`,

    getAccountUrl: (session_id: string) =>
        `${BASE_API_URL}/account?${getApiKeyQuery()}&session_id=${session_id}`,

    getLogoutConfig: (session_id: string): [string, RequestInit] => [
        `${BASE_API_URL}/authentication/session?${getApiKeyQuery()}`,
        {
            method: 'DELETE',
            body: JSON.stringify({session_id}),
            headers: {
                'Content-Type': 'application/json'


            }
        }
    ],

    newRequestTokenUrl: `${BASE_API_URL}/authentication/token/new?${getApiKeyQuery()}`,

    buildLoginRedirectUrl: (request_token: string) =>
        `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${REDIRECT_LOGGING}`,

    itemActions: {
        favorite: async (favState: boolean, movieId: number) => {
            const url = `${BASE_API_URL}/account/0/favorite?${getApiKeyQuery()}&${getSessionQuery()}`
            await fetch(url, {
                body: JSON.stringify({
                    media_type: "movie",
                    media_id: movieId,
                    favorite: favState
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            })
            return true;
        },
        watchlist: async (watchState: boolean, movieId: number) => {
            const url = `${BASE_API_URL}/account/0/watchlist?${getApiKeyQuery()}&${getSessionQuery()}`
            await fetch(url, {
                body: JSON.stringify({
                    media_type: "movie",
                    media_id: movieId,
                    watchlist: watchState
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            })
            return true;
        },
        rate: async (value: number, movieId: number) => {
            const url = `${BASE_API_URL}/movie/${movieId}/rating?${getApiKeyQuery()}&${getSessionQuery()}`
            await fetch(url, {
                body: JSON.stringify({
                    value
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            })
            return true;
        },
        unRate: async (movieId: number) => {
            const url = `${BASE_API_URL}/movie/${movieId}/rating?${getApiKeyQuery()}&${getSessionQuery()}`
            await fetch(url, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'DELETE'
            })
            return true;
        }

    },

    getItemsBrowseUrl(name: MoviesBrowseNames, searchTerm: string = '', pageOnApi: number = 1): string {
        let browseUrl = BASE_API_URL;

        // concat path
        switch (name) {
            case "favorite":
                browseUrl += "/account/0/favorite/movies";
                break;
            case "watchlist":
                browseUrl += "/account/0/watchlist/movies";
                break;
            case "search":
                browseUrl += "/search/movie";
                break;
            case "nowPlaying":
                browseUrl += "/movie/now_playing";
                break;
            case "trendingWeek":
                browseUrl += "/trending/movie/week";
                break;
        }

        browseUrl += "?";


        // concat query
        switch (name) {
            case "favorite":
                browseUrl += getSessionQuery() + "&sort_by=created_at.desc";
                break;
            case "watchlist":
                browseUrl += getSessionQuery() + "&sort_by=created_at.desc";
                break;
            case "search":
                browseUrl += `query=${searchTerm}&include_adult=false`
                break;
            case "nowPlaying":
                break;
            case "trendingWeek":
                break;
        }

        return browseUrl + "&" + getApiKeyQuery() + `&page=${pageOnApi}`;
    }

};

export default appProperties;