import {easeOutQuad} from "./util/easingFuctions";

const {REACT_APP_API_KEY} = process.env;

const appProperties = {
    //application properties here
    perPageResultsItems: 9,
    posterSrcPathPrefix: "https://image.tmdb.org/t/p/w200",
    buildApiFetchUrl: (searchTerm: string, page: number = 1) => {
        return `https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_API_KEY}&query=${searchTerm}&page=${page}&include_adult=false`;
    },
    searchPageTransitionConfig: {
        duration: 400,
        easing: easeOutQuad,
    }
};

export default appProperties;