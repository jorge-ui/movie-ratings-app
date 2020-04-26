import React, { FC, useEffect, useState } from "react";
import useAuth from "hooks/useAuth";
import styles from "./auth-page.module.scss";
import TokenData from "../../interfaces/app-types/TokenData";
import { goFetch, isValidRequestToken } from "utility";
import appProperties from "../../appProperties";

const {newRequestTokenUrl} = appProperties;

const AuthPage: FC = ({children}) => {
	const [requestToken, setRequestToken] = useState<string | null>(null);
	const {isAuth, user, signOut, signIn} = useAuth();


	useEffect(() => {
		let ignore = false;
		const localToken = getValidLocalToken();

		if (localToken)
			setRequestToken(localToken);

		else goFetch<TokenData>(newRequestTokenUrl)
				.then(tokenData => {
					localStorage.setItem("token_data", JSON.stringify(tokenData));
					!ignore && setRequestToken(tokenData.request_token);
				});

		return () => void (ignore = true)
	}, []);


	const handleLogin = () => {
		if (!requestToken) return;
		signIn(requestToken);
	};

	return (
		<div className={styles.root}>
			{isAuth ? (
				<>
					<div className={styles.userField}>
						<span>Username:</span>
						<span>{user!.username}</span>
					</div>
					<div className={styles.userField}>
						<span>Name:</span>
						<span>{user!.name || '-- '}</span>
					</div>
				</>
			) : (
				<div className={styles.userField}>
					<p>No user logged in</p>
				</div>
			)}
			{isAuth ? (
				<button onClick={signOut}>Log out</button>
			) : (
				<button disabled={!requestToken} onClick={handleLogin}>Log in</button>
			)}
			{children}
		</div>
	);
};

function getValidLocalToken(): string | null {
	const localToken = localStorage.getItem("token_data");
	if (localToken) {
		const tokenResponse = JSON.parse(localToken) as TokenData;
		return isValidRequestToken(tokenResponse) ? tokenResponse.request_token : null;
	} else return null;
}

export default AuthPage;