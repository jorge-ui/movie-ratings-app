import React from "react";
import AppBar from "./components/app-bar/app-bar.component";
import Container from "@material-ui/core/Container";
import styles from './App.module.scss';
import SearchPage from "./pages/search-page/search-page.component";


const App: React.FC = () => {
    return (
        <div className={styles.root}>
            <AppBar/>
            <Container>
                <SearchPage/>
            </Container>
        </div>
    );
};

export default App;
