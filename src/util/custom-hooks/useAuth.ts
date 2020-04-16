import { AppState, store } from "../../redux";
import { UserState } from "../../redux/user";
import { useSelector } from "react-redux";
import appProperties from "../../appProperties";
import { clearUser } from "../../redux/user/user.actions";

const {getLogoutConfig, buildLoginRedirectUrl} = appProperties;


const selectUser = (state: AppState) => state.user;

const equalUser = (left: UserState|null, right: UserState|null) => left?.id === right?.id;

function useAuth(): AuthHook {

	const user = useSelector<AppState, UserState | null>(selectUser, equalUser);

	return {
		user,
		isAuth: !!user,
		signOut: logOut,
		signIn: logIn
	}
}

function logOut() {
	const session_id = localStorage.getItem("session_id");
	if (!session_id) return;

	fetch(...getLogoutConfig(session_id))
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				console.log("logout success");
				alert("Successfully logged out.")
				store.dispatch(clearUser());
				localStorage.removeItem("session_id");
			}
		})
		.catch(console.log)
}

function logIn(requestToken: string) {
	const opened = window.open(buildLoginRedirectUrl(requestToken), "_blank");
	console.log({opened});
}

interface AuthHook {
	user: UserState | null,
	isAuth: boolean,
	signOut: () => void,
	signIn: (requestToken: string) => void,
}

export default useAuth;