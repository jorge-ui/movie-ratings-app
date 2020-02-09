import React from "react";
import NavBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import styles from './app-bar.module.scss';

const AppBar = () => {
    return (
        <NavBar position="static" className={styles.root}>
            <Toolbar className={styles.toolBar}>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" className={styles.title}>Movie Ratings App</Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </NavBar>
    );
};

export default AppBar;
