import { UserActions, UserState } from "./index";

export enum UserActionsTypes {
	SET_USER = "SET_USER",
	CLEAR_USER = "CLEAR_USER"
}


export const setUser = (user: UserState): UserActions => ({
	type: UserActionsTypes.SET_USER,
	payload: user
});

export const clearUser = (): UserActions => ({
	type: UserActionsTypes.CLEAR_USER
});