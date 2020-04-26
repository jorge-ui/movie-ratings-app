import React, { FC, memo } from "react";
import styles from "./home-page.module.scss";
import ThisWeekContainer from "./subcomponents/this-week-container.component";
import NowPlayingContainer from "./subcomponents/now-playing-container.component";


const HomePage: FC = () => {

	return (
		<div className={styles.root}>
			<h1>Movie Ratings App</h1>
			<div className={styles.content}>
				<SpotlightSection title="Trending This Week">
					<ThisWeekContainer/>
				</SpotlightSection>
				<SpotlightSection title="Now Playing">
					<NowPlayingContainer/>
				</SpotlightSection>
			</div>
		</div>
	);
};

const SpotlightSection: FC<{ title: string }> = ({title, children}) => (
	<div className={styles.sectionSpotlight}>
		<h2 className={styles.sectionTitle}>{title}</h2>
		<div className={styles.sectionContentWrapper}>
			<div className={styles.sectionContent}>
				{children}
			</div>
		</div>
	</div>
);

export default memo(HomePage, () => true);