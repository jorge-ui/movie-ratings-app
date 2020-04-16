import React, { FC } from 'react';
import styles from './movie-view-screen.module.scss';
import { animated, UnknownProps, useTransition, UseTransitionProps } from "react-spring";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import usePrevious from "../../util/custom-hooks/usePrevious";
import MovieViewItem from "../movie-view-item/movie-view-item.component";
import MovieViewEvent from "../../util/custom-events/MovieViewEvent";
import useOnMovieView from "../../util/custom-hooks/useOnMovieView";
import IMovieView from "../../interfaces/app-types/IMovieView";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import useMovieForView from "../../util/custom-hooks/useMovieForView";
import useIsMobile from "../../util/custom-hooks/useIsMobile";


type ItemState = IMovieResultItem | IMovieView | null;

const MovieViewScreen: FC = () => {
	const isMobile = useIsMobile();

	const {movieViewItem, isLoading, clearMovieId} = useMovieForView();

	const transitionConfig = getTransitionConfig(movieViewItem, isMobile);

	const prevConfig = usePrevious(transitionConfig);

	const appliedConfig = movieViewItem ? transitionConfig : (prevConfig ?? {});

	const transition = useTransition(movieViewItem, movieViewItem?.id || 0, appliedConfig);

	return (
		<>
			{!isMobile ? (
				transition.map(({props, key, item: movieItem}) => movieItem &&
                    <MovieViewRootDiv clearMovieId={clearMovieId} movieViewItem={movieItem} key={key}>
                        <animated.div key={key} className={styles.transitionDiv} style={props as any}>
                            <MovieViewItem movieItem={movieItem}/>
                        </animated.div>
                    </MovieViewRootDiv>
				)) : (
				transition.map(({item: movieItem, key}) => movieItem &&
                    <MovieViewItem key={key} movieItem={movieItem}/>
				)
			)}
			{isLoading && <LoadingSpinner fixed darken delay={700}/>}
		</>
	);
};

interface RootDivProps {
	movieViewItem: ItemState;
	clearMovieId: () => void;
}

const MovieViewRootDiv: FC<RootDivProps> = React.memo(({children, movieViewItem, clearMovieId}) => {
	const [backgroundColor] = useOnMovieView(movieViewItem?.id || 0, '', {
		onEnter: `rgba(0, 0, 0, 0.5)`,
		onClose: undefined
	});

	function handleClickAway({target, currentTarget}: React.MouseEvent<HTMLDivElement>) {
		if (target === currentTarget) {
			(target as HTMLDivElement).style.backgroundColor = "rgba(0, 0, 0, 0)";
			clearMovieId();
		}
	}

	return (
		<div className={styles.root} onClick={handleClickAway}
		     style={{backgroundColor}}>
			{children}
		</div>
	);
}, () => true);

function getTransitionConfig(movie: ItemState, isMobile: boolean): UnknownProps & UseTransitionProps<ItemState> {
	if (!movie) return {};
	let animatedDiv = document.getElementById("main-container") as HTMLDivElement;
	const domRect = document.getElementById(String(movie.id))?.getBoundingClientRect();
	if (!!movie) {
		let animatedDomRect = animatedDiv.firstElementChild!.getBoundingClientRect();

		let initialPosition;

		if (domRect) {
			initialPosition = {
				top: domRect.top,
				left: domRect.left,
				bottom: window.innerHeight - domRect.bottom,
				width: domRect.width,
			};
		} else {
			initialPosition = {
				top: window.innerHeight,
				left: animatedDomRect.left,
				bottom: -10,
				width: animatedDomRect.width,
				opacity: 0
			};
		}


		return {
			from: initialPosition,
			enter: {
				top: window.innerHeight * .10,
				left: animatedDomRect.x,
				bottom: -10,
				width: animatedDomRect.width,
				opacity: 1
			},
			leave: {
				...initialPosition,
				config: {
					mass: 1.5 && 12,
					tension: 170,
					friction: 24,
					clamp: true
				},
			},
			config: isMobile ? {
				duration: 0,
			} : {
				mass: 1.3 && 11,
				tension: 350,
				friction: 97,
				precision: 0.8,
				clamp: true
			},
			onStart: !isMobile ? (item: ItemState, state: string) => {
				if (item) {
					if (state === "enter") {
						setTimeout(() => {
							dispatchEvent(new MovieViewEvent(item.id, "enter"));
						}, 50);
					} else if (state === "leave")
						dispatchEvent(new MovieViewEvent(item.id, "close"));
				}
			} : undefined,
			onRest: !isMobile ? (item: ItemState, state: string) => {
				if (item) {
					if (state === "leave")
						dispatchEvent(new MovieViewEvent(item.id, "leave"));
					else if (state === "enter")
						dispatchEvent(new MovieViewEvent(item.id, "view"));
				}
			} : undefined
		};
	} else return {};
}

export default React.memo(MovieViewScreen, () => true);