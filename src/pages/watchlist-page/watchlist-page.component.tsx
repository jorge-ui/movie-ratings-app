import React, { FC } from "react";
import useSavedSessionParams from "hooks/useSavedSessionParams";
import ItemsList from "components/items-list";

const WatchlistPage: FC = () => {

	useSavedSessionParams();

    return <ItemsList itemType="watchlist" />
};


export default WatchlistPage;