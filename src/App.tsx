import React, { FC, useEffect } from "react";
import AppBar from "./components/app-bar/app-bar.component";
import Container from "@material-ui/core/Container";
import styles from './App.module.scss';
import SearchPage from "./pages/search-page/search-page.component";
import { goFetchUserAccount } from "./util/utilityFunctions";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import { Route, Switch } from 'react-router-dom';
import HomePage from "./pages/home-page/home-page.component";
import MovieViewScreen from "./components/movie-view-screen/movie-view-screen.component";
import { setUser } from "./redux/user/user.actions";
import { store } from "./redux";
import AuthPage from "./pages/auth-page/auth-page.component";
import useIsMobile from "./util/custom-hooks/useIsMobile";

const routesChildren = (
	<>
		<Route exact path="/" render={() => <HomePage/> } />
		<Route path="/search" render={() => <SearchPage/> } />
		<Route path="/favorites" render={() => <div>Favorites</div> } />
		<Route path="/watchlist" render={() => <div>Watchlist</div> } />
		<Route path="/account" render={() => <AuthPage/> } />
	</>
);


const App: FC = () => {
	const isMobile = useIsMobile();

	useEffect(() => {
		sessionStorage.clear();
		goFetchUserAccount()
			.then(user => store.dispatch(setUser(user)))
			.catch(console.error)
	}, []);

	return (<div className={styles.root}>
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
	</div>);
};


export default App;
