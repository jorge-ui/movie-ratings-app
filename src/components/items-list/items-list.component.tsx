import { ActionItemName } from "../../redux/item-list";
import React, { FC, useEffect, useLayoutEffect } from "react";
import useSearchParam from "../../util/custom-hooks/useSearchParam";
import useAuth from "../../util/custom-hooks/useAuth";
import { AppActions, AppState, store } from "../../redux";
import { fetchListItemsAsync } from "../../redux/item-list/list-item.actions";
import useEffectSkipFirst from "../../util/custom-hooks/useEffectSkipFirst";
import { useSelector } from "react-redux";
import IMovieResultItem from "../../interfaces/app-types/IMovieResultItem";
import PaginationControls from "../pagination-controls/pagination-controls.component";


interface Props {
	itemType: ActionItemName;
}

const ItemsList: FC<Props> = ({itemType}) => {
	const [page = 0, setPage] = useSearchParam("page");

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

	const selected = useSelector<AppState, IMovieResultItem[]>(state => {
		let listState = state[itemType];
		if (!isAuth) return [];
		return selectItemsFromState(listState, page);
	}, equality);

	const isLoading = useSelector<AppState, boolean>(state => {
		return state[itemType].isLoading
	});

	const totalPages = useSelector<AppState, number>(state => {
		return state[itemType].total_pages;
	})

	return (
		<div>
			{!!totalPages && <PaginationControls totalPages={totalPages}/>}
			{selected.map((item, i) => !!item && (
				<div key={item.id}>{i + 1}) {item.title}</div>
			))}
		</div>
	);
};

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

const equality = (left: IMovieResultItem[], right: IMovieResultItem[]) => left.length === right.length

export default ItemsList;