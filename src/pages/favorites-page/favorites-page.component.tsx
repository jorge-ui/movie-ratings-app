import React, { FC } from "react";
import useSavedSessionParams from "hooks/useSavedSessionParams";
import ItemsList from "components/items-list";


const FavoritesPage: FC = () => {

    useSavedSessionParams();

    return <ItemsList itemType="favorite" />
};

export default FavoritesPage;