import React, { Dispatch, FC, SetStateAction, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import styles from "./app-bar.module.scss";
// import styles from "./app-bar.module.scss";
import { Link } from "react-router-dom";
import useLocationPath from "hooks/useLocationPath";
import useAuth from "hooks/useAuth";
import useIsMobile from "hooks/useIsMobile";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";
import store from "../../store";
import getMoviesBrowserActions from "../../store/movies-browser/movies-browser.actions";

const searchActions = getMoviesBrowserActions("search");

const navItems = [
	{
		icon: HomeIcon,
		text: "Home",
		to: "/"
	},
	{
		icon: SearchIcon,
		text: "Search",
		to: "/search"
	},
	{
		icon: FavoriteIcon,
		text: "Favorites",
		to: "/favorites"
	},
	{
		icon: BookmarkIcon,
		text: "Watchlist",
		to: "/watchlist"
	},
] as const;


type NavPaths = (typeof navItems[number])["to"] | "/account"

interface INavItem {
	icon:  OverridableComponent<SvgIconTypeMap>
	text: string,
	to: NavPaths
}

const AppBar = () => {
	const [isOpen, setOpen] = useState(false);
	const pathname = useLocationPath();

	const { user } = useAuth();

	return (
		<nav className={`${styles.root} ${isOpen ? styles.isOpen : ''}`}
		     onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
			<ul className={styles.toolBar}>
				<li className={styles.navItem}>
					<span className={`${styles.navItemTxt} ${styles.logo}`}>MovieApp</span>
					<IconButton color="inherit" aria-label="menu" className={styles.navItemIcon}>
						<DoubleArrowIcon/>
					</IconButton>
				</li>
				{navItems.map((item, i) =>
					<NavItem key={i} {...item} setOpen={setOpen} active={item.to === pathname}/>
				)}
				<NavItem
					active={"/account" === pathname}
					setOpen={setOpen} to="/account"
					icon={AccountCircleIcon} text={user?.username || "Login"}
					username={user?.username}
				/>
			</ul>
		</nav>
	);
};

interface INavItemProps {
	active: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
	username?: string
}

type NavItemProps = INavItemProps & INavItem;

const NavItem: FC<NavItemProps> = ({icon: Icon, text, to, setOpen, active, username}) => {

	const isMobile = useIsMobile();

	function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
		if (e.currentTarget === e.target)
			return e.preventDefault();
		!isMobile && setOpen(false);

		if (to === "/search" && active)
			store.dispatch(searchActions.clearFetchedMovies())
	}

	return (
		<Link to={to} className={styles.navItem} onClick={handleClick} aria-current={active}>
			<IconButton color="inherit" aria-label="menu" className={styles.navItemIcon}>
				{username ?
					<div className={styles.avatar} >{username.charAt(0).toUpperCase()}</div>
					: <Icon/>
				}
			</IconButton>
			{text && <span className={styles.navItemTxt}>{text}</span>}
		</Link>
	);
};

export default AppBar;
