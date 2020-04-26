import React, { FC } from 'react';
import { RouteProps } from "react-router";
import useAuth from "../../hooks/useAuth";
import { Route } from 'react-router-dom';
import AuthPage from "../../pages/auth-page";


const AuthRoute: FC<RouteProps> = ({component: Component, render, ...rest}) => {
	const {isAuth} = useAuth();

	return <Route {...rest} render={(props) => {
		if (!isAuth)
			return <AuthPage/>
		else if (Component)
			return <Component {...props} />
		else if (render)
			return render(props)
		else return null
	}}/>
};


export default AuthRoute;