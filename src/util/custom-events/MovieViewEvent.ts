class MovieViewEvent extends CustomEvent<IMovieViewEventDetail> {
    constructor(movieId: number, state: MovieViewEventState) {
        super("movieView", {
            detail: {
                movieId,
                state
            }
        });
    }
}

export type MovieViewEventState = "enter" | "update" | "view" | "close" | "leave"

interface IMovieViewEventDetail {
    movieId: number,
    state: MovieViewEventState
}

export default MovieViewEvent;