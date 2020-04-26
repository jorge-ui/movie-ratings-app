import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import React, { FC, memo, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpring } from "react-spring";
import { setMovieView } from "store/movie-view/movie-view.actions";
import appProperties from "../../appProperties";
import styles from "./items-scroll-x.module.scss";
import store from "../../store";

const { getPosterSrcPathPrefix } = appProperties;


interface OwnProps {
	noResultsFound: boolean;
	isLoading?: boolean;
	items?: IMovieResultItem[];
	className?: string;
	scrollByX?: number;
	itemClassName?: string;
	infoTabMessage?: string;
}

const MovieItemsXScrollList: FC<OwnProps> =
({isLoading = false, noResultsFound, items = [], className, scrollByX = 200, infoTabMessage, itemClassName}) => {

	const rootRef = useRef<HTMLDivElement>(null);

	const [scrollXPos, setScrollXPos] = useState(0);

	const [, update] = useSpring(() => ({
		to: {scrollXPos},
		onFrame: ({scrollXPos}) => {
			rootRef.current!.scroll(scrollXPos as number, 0);
		},
	}));

	useEffect(() => {
		update({scrollXPos});
	}, [scrollXPos, update]);

	const onMouseMoveHandler = useCallback(function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
		const {scrollWidth, clientWidth} = e.currentTarget;
		const maxScrollLeft = scrollWidth - clientWidth;
		let {movementX} = e;

		if (e.buttons === 1)
			setScrollXPos((prevState) => {
				let nextState = prevState - movementX * 1.5;
				if (nextState > 0 && nextState <= maxScrollLeft) return nextState;
				else if (nextState > maxScrollLeft) return maxScrollLeft;
				else return 0;
			});
	}, []);

	const onWheelHandler = useCallback(function onWheelHandler(e: React.WheelEvent<HTMLDivElement>) {
		const {scrollWidth, clientWidth} = e.currentTarget;
		const maxScrollLeft = scrollWidth - clientWidth;

		if (e.deltaY < 0)
			// scroll to left
			setScrollXPos((prevState) => {
				return prevState > 0 ? prevState - scrollByX : 0;
			});
		else
			setScrollXPos((prevState) => {
				const nextState = prevState + scrollByX;
				if (nextState < maxScrollLeft) return nextState;
				else return maxScrollLeft;
			});
	},[scrollByX]);

	const onDownRef = useRef(0);
	const onUpRef = useRef(0);
	const canClick = () => onDownRef.current === onUpRef.current;

	const itemChildren = useMemo(() => items.map((movie) => (
		<RelatedMovieItem
			key={movie.key}
			movie={movie}
			canClick={canClick}
			itemClassName={itemClassName}
		/>
	)), [items.length, itemClassName]);

	return (
		<div
			className={`${styles.root} ${className || ''}`}
			onWheel={noResultsFound ? undefined:onWheelHandler}
			onMouseMove={noResultsFound ? undefined:onMouseMoveHandler}
			ref={rootRef}
			onMouseDown={(setClientXOnRef.bind(null, onDownRef) as any)}
			onMouseUp={(setClientXOnRef.bind(null, onUpRef) as any)}
			style={{
				overflowX: isLoading || noResultsFound ? "hidden" : "scroll",
				opacity: noResultsFound ? 0.5 : 1,
			}}
			{...(infoTabMessage ? {"info-tab": infoTabMessage} : {})}
		>
			{noResultsFound ? (
				<>
					{[...new Array(5)].map((v, i) => (
						<RelatedMovieItem isLoading={false} movie={null} key={i}/>
					))}
					<div className={styles.noMoviesFound}>No related movies found</div>
				</>
			) : (
				<>
					{itemChildren}
				</>
			)}
		</div>
	)
};

interface RelatedMovieItemProps {
	isLoading?: boolean;
	movie: IMovieResultItem | null;
	canClick?: () => boolean;
	itemClassName?: string;
}

const RelatedMovieItem: FC<RelatedMovieItemProps> =
	memo(({isLoading = false, movie, canClick = (() => false), itemClassName}) => {
		const imgSrc = movie && movie.poster_path && `url(${getPosterSrcPathPrefix("300")}${movie.poster_path})`;

		const onClickHandler = () => canClick() && movie && store.dispatch(setMovieView(movie));

		return (
			<div
				className={`${styles.relatedMovieItemWrapper} ${itemClassName || ''}`}
				onDragStart={preventDefault as any}
			>
				<div className={`
						${styles.relatedMovieItem}
						${isLoading ? styles.isLoadingItem : ''}
						${(!imgSrc && !isLoading) ? styles.noPoster : ''}
					`}
				     title={movie?.title}
				     style={{backgroundImage: imgSrc || undefined}}
				     onDragStart={preventDefault as any}
				     onClick={movie ? onClickHandler : undefined}
				>{!imgSrc && movie ? movie.title : null}</div>
			</div>
		);
	}, (prevProps, nextProps) => prevProps.isLoading === nextProps.isLoading);


function setClientXOnRef(ref: MutableRefObject<number>, ev: React.MouseEvent) {
	ref.current = ev.clientX;
}

function preventDefault(e: Event) {
	e.preventDefault();
}

export default MovieItemsXScrollList;