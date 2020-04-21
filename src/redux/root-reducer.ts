import { combineReducers } from "redux";
import searchReducer from "./search/search.reducer";
import movieViewReducer from "./movie-view/movie-view.reducer";
import homePageReducer from "./home-page/home-page.reducer";
import userReducer from "./user/user.reducer";
import createListItemReducer from "./item-list/list-item.reducer";


const rootReducer = combineReducers({
  search: searchReducer,
  movieItem: movieViewReducer,
  homePage: homePageReducer,
  user: userReducer,
  favorite: createListItemReducer("favorite"),
  watchlist: createListItemReducer("watchlist")
});

export default rootReducer;
