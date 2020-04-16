import { UserActionsTypes } from "./user.actions";

export interface Gravatar {
	hash: string;
}

export interface Avatar {
	gravatar: Gravatar;
}

export interface UserState {
	avatar: Avatar;
	id: number;
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	include_adult: boolean;
	username: string;
}

interface ISetUser {
	type: UserActionsTypes.SET_USER,
	payload: UserState
}

interface IClearUser {
	type: UserActionsTypes.CLEAR_USER
}

export type UserActions =
	| ISetUser
	| IClearUser