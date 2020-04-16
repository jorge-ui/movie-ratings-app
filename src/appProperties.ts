import { easeOutQuad } from "./util/easingFuctions";

const {REACT_APP_API_KEY: API_KEY, NODE_ENV} = process.env;
const BASE_API_URL = 'https://api.themoviedb.org/3'

type ImageSizes = "200" | "300" | "400" | "500";

const REDIRECT_LOGGIN = NODE_ENV === 'development' ?
    'http://192.168.1.8:3000/' : ''; //TODO: 'production' url is missing

const appProperties = {
    //application properties here
    perPageResultsItems: 9,

    getPosterSrcPathPrefix: (size: ImageSizes = "200") =>  `https://image.tmdb.org/t/p/w${size}`,

    buildFetchMovieSearchUrl: (searchTerm: string, page: number = 1) =>
        `${BASE_API_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}&include_adult=false`,

    buildFetchMovieViewUrl: (movieId: number, addPath?: string) => {
        return `${BASE_API_URL}/movie/${movieId}${addPath || ''}?api_key=${API_KEY}`;
    },

    searchPageTransitionConfig: {
        duration: 400,
        easing: easeOutQuad,
    },

    newSessionUrl: `${BASE_API_URL}/authentication/session/new?api_key=${API_KEY}`,

    buildAccountUrl: (session_id: string) =>
        `${BASE_API_URL}/account?api_key=${API_KEY}&session_id=${session_id}`,

    getLogoutConfig: (session_id: string): [string, RequestInit] => [
        `${BASE_API_URL}/authentication/session?api_key=${API_KEY}`,
        {
            method: 'DELETE',
            body: JSON.stringify({session_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ],

    newRequestTokenUrl: `${BASE_API_URL}/authentication/token/new?api_key=${API_KEY}`,

    buildLoginRedirectUrl: (request_token: string) =>
        `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${REDIRECT_LOGGIN}`,

    itemActions: {
        favorite: async (favState: boolean, movieId: number) => {
            const url = `${BASE_API_URL}/account/0/favorite?api_key=${API_KEY}&session_id=${localStorage.getItem("session_id")}`
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
            const url = `${BASE_API_URL}/account/0/watchlist?api_key=${API_KEY}&session_id=${localStorage.getItem("session_id")}`
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
            const url = `${BASE_API_URL}/movie/${movieId}/rating?api_key=${API_KEY}&session_id=${localStorage.getItem("session_id")}`
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
            const url = `${BASE_API_URL}/movie/${movieId}/rating?api_key=${API_KEY}&session_id=${localStorage.getItem("session_id")}`
            await fetch(url, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'DELETE'
            })
            return true;
        }

    }

};

export default appProperties;