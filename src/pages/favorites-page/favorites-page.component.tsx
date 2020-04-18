import React, { FC } from 'react';
import useSavedSessionParams from "../../util/custom-hooks/useSavedSessionParams";
import ItemsList from "../../components/items-list/items-list.component";


const FavoritesPage: FC = () => {

    useSavedSessionParams();

    return <ItemsList itemType="favorite" />
};

export default FavoritesPage;