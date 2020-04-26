import React, { CSSProperties, FC, memo, useEffect } from "react";
import PaginationControls from "components/pagination-controls";
import styles from "./items-list.module.scss";
import LoadingSpinner from "components/loading-spinner";
import ListItem from "components/list-item";
import MovieItemsContainer from "components/movie-results-container";
import { animated, useTransition } from "react-spring";
import { easeOutQuad } from "../../utility/easingFuctions";
import { UnknownProps, UseTransitionProps } from "@react-spring/core";
import useMovieItems, { ItemsPortionUI } from "../../hooks/useMovieItems";
import useSearchParam from "../../hooks/useSearchParam";
import { AccountItemsNames } from "../../store/movies-browser";

interface Props {
	itemType: AccountItemsNames;
}

const ItemsList: FC<Props> = ({itemType}) => {

	const {items, totalPagesUI, pageUI, isLoading} = useMovieItems({name: itemType});

	const [, setPage] = useSearchParam("page");

	useEffect(() => {
		setPage(currentValue => currentValue ? currentValue : 1)
	}, [setPage]);

	const title = itemType === "favorite" ? "Favorites" : "Watchlist";

	return (
		<div className={styles.root}>
			<div className={styles.head}>
				<h2 className={styles.title}>{title}</h2>
				{totalPagesUI>1 && <PaginationControls totalPages={totalPagesUI}/>}
			</div>

			{isLoading && <LoadingSpinner darken fixed delay={750} />}
			<MovieItemsContainer page={pageUI}>
				{() => <ListChild items={items} />}
			</MovieItemsContainer>
		</div>
	);
};

interface ListChildProps {
	items: ItemsPortionUI
}

const ListChild: FC<ListChildProps> = memo(({items}) => {

	const transition = useTransition(items, item => item.key, transitionConfig);

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

const initialStyles: CSSProperties & UnknownProps = {
	opacity: 1,
	maxHeight: 500,
	translateX: 0,
	paddingBottom: 20,
};

const transitionConfig: UnknownProps & UseTransitionProps = {
	from: initialStyles,
	enter: initialStyles,
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

export default ItemsList;