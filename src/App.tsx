import React, { FC, useEffect } from "react";
import AppBar from "./components/app-bar";
import Container from "@material-ui/core/Container";
import styles from "./App.module.scss";
import SearchPage from "pages/search-page";
import { goFetchUserAccount } from "utility";
import { Route, Switch } from "react-router-dom";
import HomePage from "pages/home-page";
import MovieViewScreen from "components/movie-view-screen";
import { setUser } from "store/user/user.actions";
import store from "store";
import AuthPage from "pages/auth-page";
import useIsMobile from "hooks/useIsMobile";
import WatchlistPage from "pages/watchlist-page";
import FavoritesPage from "pages/favorites-page";
import AuthRoute from "components/auth-route";
import ApiLogo from "./components/api-logo/api-logo.component";

const routesChildren = (
	<>
		<Route exact path="/" render={() => <HomePage /> } />
		<Route path="/search" render={() => <SearchPage /> } />
		<AuthRoute path="/favorites" render={() => <FavoritesPage /> } />
		<AuthRoute path="/watchlist" render={() => <WatchlistPage /> } />
		<Route path="/account" render={() => <AuthPage /> } />
	</>
);


const App: FC = () => {
	const isMobile = useIsMobile();

	useEffect(() => {
		console.log("loaded movie-ratings-app v1.1.5");
		sessionStorage.clear();
		goFetchUserAccount()
			.then(user => store.dispatch(setUser(user)))
			.catch(console.error)
	}, []);

	return (
		<div className={styles.root}>
			<AppBar/>
			<main className={styles.main} id="main-container">
				<Container>
					{!isMobile ? (
						<Switch>
							{routesChildren}
						</Switch>
						) : (
						<Route render={ ({location}) => {
							if (!location.search.includes('movieId'))
								return (
									<Switch location={location}>
										{routesChildren}
									</Switch>
								);
							else return <MovieViewScreen/>
						}}/>
					)}
				</Container>
				{!isMobile && <MovieViewScreen/>}
			</main>
			<ApiLogo />
		</div>
	);
};


export default App;
