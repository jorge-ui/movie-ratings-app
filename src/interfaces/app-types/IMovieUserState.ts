export default interface IMovieUserState {
	id: number;
	favorite: boolean;
	rated: Rated | boolean;
	watchlist: boolean;
}

export interface Rated {
	value: number;
}