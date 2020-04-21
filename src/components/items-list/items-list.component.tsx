import { ActionItemName } from "../../redux/item-list";
import React, { FC, memo, useEffect, useLayoutEffect } from "react";
import useSearchParam from "../../util/custom-hooks/useSearchParam";
import useAuth from "../../util/custom-hooks/useAuth";
import { AppActions, AppState, store } from "../../redux";
import { fetchListItemsAsync } from "../../redux/item-list/list-item.actions";
import useEffectSkipFirst from "../../util/custom-hooks/useEffectSkipFirst";
import { useSelector } from "react-redux";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import PaginationControls from "../pagination-controls/pagination-controls.component";
import styles from './items-list.module.scss';
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import ListItem from "../list-item/list-item.component";
import MovieItemsContainer from "../movie-results-container/movie-results-container.component";
import { animated, useTransition } from 'react-spring';
import { easeOutQuad } from "../../util/easingFuctions";
import { UnknownProps, UseTransitionProps } from "@react-spring/core";

interface Props {
	itemType: ActionItemName;
}

const ItemsList: FC<Props> = ({itemType}) => {
	const [page = 1, setPage] = useSearchParam("page");

	const {isAuth} = useAuth();

	useEffect(() => {
		if (!store.getState()[itemType].results && isAuth)
			store.dispatch(
				fetchListItemsAsync(1, itemType) as unknown as AppActions);
	}, [isAuth]);

	useLayoutEffect(() => {
		setPage(page => page === null ? 1 : page)
	}, []);

	useEffectSkipFirst(() => {
		let {isLoading, apiFetchedPages} = store.getState()[itemType];
		if (!isLoading && !apiFetchedPages.includes(page))
			store.dispatch(
				fetchListItemsAsync(page, itemType) as unknown as AppActions);
	}, [page]);

	const isLoading = useSelector<AppState, boolean>(state => {
		return state[itemType].isLoading
	});

	const totalPages = useSelector<AppState, number>(state => {
		return state[itemType].total_pages;
	})

	const title = itemType === "favorite" ? "Favorites" : "Watchlist";

	return (
		<div className={styles.root}>
			<div className={styles.head}>
				<h2 className={styles.title}>{title}</h2>
				{totalPages>1 && <PaginationControls totalPages={totalPages}/>}
			</div>

			{isLoading && <LoadingSpinner darken fixed delay={750} />}
			<MovieItemsContainer page={page}>
				{(currentPage) => <ListChild page={currentPage} itemType={itemType} />}
			</MovieItemsContainer>
		</div>
	);
};

interface ListChildProps {
	page: number;
	itemType: ActionItemName
}

const ListChild: FC<ListChildProps> = memo(({itemType, page}) => {

	const selected = useSelector<AppState, IMovieResultItem[]>(state => {
		let listState = state[itemType];
		return selectItemsFromState(listState, page);
	}, equality);

	const transition = useTransition(selected, item => item.id, transitionConfig);

	return (
		<>
			{
				transition.map(({item, key, props}) => !!item && (
					<animated.div
						key={key}
						style={{
							...props,
							transform: props.translateX.interpolate(v =>
								v ? `translateX(${v}px)` : ''
							)
						}}
					>
						<ListItem item={item} />
					</animated.div>
				))

			}
		</>
	);
})

function selectItemsFromState(itemsState: AppState["favorite" | "watchlist"], page: number) {
	let selected: IMovieResultItem[] = [];
	if (itemsState.isLoading || !itemsState.results || !page) return selected;

	else if (itemsState.apiFetchedPages.includes(page))
		for (let i = 0; i < 20; i++) {
			let index = (page - 1) * 20 + i;
			let item = itemsState.results[index];
			if (item) selected[i] = item;
			else break;
		}

	return selected;
}

const transitionConfig: UnknownProps & UseTransitionProps = {
	from: {
		opacity: 1,
		maxHeight: 500,
		translateX: 0,
		paddingBottom: 20,
	},
	leave: () => async next => {
		// @ts-ignore
		next({maxHeight: 0, paddingBottom: 0, delay: 300}).catch(() => void 0)
		// @ts-ignore
		next({ opacity: -.2, translateX: 300 }).catch(() => void 0)
	},
	config: {
		duration: 500,
		easing: easeOutQuad
	},
	unique: true
}

const equality = (newS: IMovieResultItem[], oldS: IMovieResultItem[]) =>
	((newS.length === 20) &&
		(newS[0].id === oldS[0].id) &&
			(newS[newS.length - 1].id === oldS[oldS.length - 1].id))
	|| (newS.length < 20 && (newS.length === oldS.length))

export default ItemsList;