import React, {useEffect} from "react";
import AppBar from "./components/app-bar/app-bar.component";
import Container from "@material-ui/core/Container";
import styles from './App.module.scss';
import SearchPage from "./pages/search-page/search-page.component";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {MovieActionTypes} from "./interfaces/action-types/IMoviesActions";
import IMoviesSearchData from "./interfaces/app-types/IMoviesSearchData";
import {AppActions} from "./interfaces/action-types/AppActions";


const App: React.FC = () => {
    let dispatch = useDispatch<Dispatch<AppActions>>();
    useEffect(() => {
        sessionStorage.clear();
        dispatch({ //TODO: dispatch hardcoded for dev purpose
            type: MovieActionTypes.FETCH_MOVIES_SUCCESS,
            payload: {
                data: initStoreStateData,
                searchTerm: 'you'
            }
        });
    }, [dispatch]);
    return (
        <div className={styles.root}>
            <AppBar/>
            <Container>
                <SearchPage/>
            </Container>
        </div>
    );
};

const initStoreStateData: IMoviesSearchData = {
    page: 1,
        total_results: 7871,
        total_pages: 394,
        results: {
        0: {
            popularity: 39.055,
                vote_count: 140,
                video: false,
                poster_path: '/jNvlqNDnXH8aqBeiBxNNP0wWWO3.jpg',
                id: 522369,
                adult: false,
                backdrop_path: '/yjCW0qLgmyBUuv3KwRkuwy6yfmv.jpg',
                original_language: 'en',
                original_title: 'Sorry We Missed You',
                genre_ids: [
                18
            ],
                title: 'Sorry We Missed You',
                vote_average: 7.7,
                overview: 'From the Director of I Daniel Blake (Ken Loach) comes another hard hitting dose of reality. Ricky and his family have been fighting an uphill struggle against debt since the 2008 financial crash. An opportunity to wrestle back some independence appears with a shiny new van and the chance to run a franchise as a self-employed delivery driver. It\'s hard work, and his wife\'s job as a carer is no easier. The family unit is strong but when both are pulled in different directions everything comes to breaking point.',
                release_date: '2019-10-04',
                key: 0
        },
        1: {
            popularity: 14.639,
                vote_count: 6659,
                video: false,
                poster_path: '/oN5lELHH5Xheiy0YdhnY3JB4hx2.jpg',
                id: 296096,
                adult: false,
                backdrop_path: '/o4lxNwKJz8oq3R0kLOIsDlHbDhZ.jpg',
                original_language: 'en',
                original_title: 'Me Before You',
                genre_ids: [
                18,
                10749
            ],
                title: 'Me Before You',
                vote_average: 7.7,
                overview: 'A small town girl is caught between dead-end jobs. A high-profile, successful man becomes wheelchair bound following an accident. The man decides his life is not worth living until the girl is hired for six months to be his new caretaker. Worlds apart and trapped together by circumstance, the two get off to a rocky start. But the girl becomes determined to prove to the man that life is worth living and as they embark on a series of adventures together, each finds their world changing in ways neither of them could begin to imagine.',
                release_date: '2016-06-01',
                key: 1
        },
        2: {
            popularity: 8.297,
                vote_count: 501,
                video: false,
                poster_path: '/tJl9pbuY8e3Qv9ylpC61tmm0B4h.jpg',
                id: 290542,
                adult: false,
                backdrop_path: '/ke1ElBrgbSAF3D8YeP42uFKpVMN.jpg',
                original_language: 'en',
                original_title: 'You\'re Not You',
                genre_ids: [
                18
            ],
                title: 'You\'re Not You',
                vote_average: 7.4,
                overview: 'A drama centered on a classical pianist who has been diagnosed with ALS and the brash college student who becomes her caregiver.',
                release_date: '2014-10-10',
                key: 2
        },
        3: {
            popularity: 15.881,
                id: 75656,
                video: false,
                vote_count: 10876,
                vote_average: 7.4,
                title: 'Now You See Me',
                release_date: '2013-05-29',
                original_language: 'en',
                original_title: 'Now You See Me',
                genre_ids: [
                53,
                80
            ],
                backdrop_path: '/9wbXqcx6rHhoZ9Esp03C7amQzom.jpg',
                adult: false,
                overview: 'An FBI agent and an Interpol detective track a team of illusionists who pull off bank heists during their performances and reward their audiences with the money.',
                poster_path: '/A06e9YJ5ry3WXEIFIAD1mKBxcuZ.jpg',
                key: 3
        },
        4: {
            popularity: 8.992,
                vote_count: 216,
                video: false,
                poster_path: '/usr1q0DDMR23jsTZoIe3NtRRz3r.jpg',
                id: 12658,
                adult: false,
                backdrop_path: '/xvo3f0Ka4VNLEsJu8nlXlYDLrws.jpg',
                original_language: 'en',
                original_title: 'Someone Like You...',
                genre_ids: [
                35,
                10749
            ],
                title: 'Someone Like You...',
                vote_average: 6,
                overview: 'Jane Goodale has everything going for her. She\'s a producer on a popular daytime talk show, and is in a hot romance with the show\'s dashing executive producer Ray. But when the relationship goes terribly awry, Jane begins an extensive study of the male animal, including her womanizing roommate Eddie. Jane puts her studies and romantic misadventure to use as a pseudonymous sex columnist -- and becomes a sensation.',
                release_date: '2001-03-30',
                key: 4
        },
        5: {
            popularity: 8.863,
                vote_count: 478,
                video: false,
                poster_path: '/hkflwtWCJffdDSwg63fdDFbwOvS.jpg',
                id: 450489,
                adult: false,
                backdrop_path: '/i60mGxEh6NT8qcR1sHDefmSTSCT.jpg',
                original_language: 'en',
                original_title: 'Irreplaceable You',
                genre_ids: [
                35,
                18,
                10749
            ],
                title: 'Irreplaceable You',
                vote_average: 7.1,
                overview: 'A couple who have known each other since 8 are destined to be together until death do them apart.',
                release_date: '2018-02-16',
                key: 5
        },
        6: {
            popularity: 23.144,
                vote_count: 316,
                video: false,
                poster_path: '/9fqzZs922V8OmwgO11Eqclof2mQ.jpg',
                id: 448095,
                adult: false,
                backdrop_path: '/7rqpB7coXaNvTVMWb5vL8qU0pBp.jpg',
                original_language: 'en',
                original_title: 'I Still See You',
                genre_ids: [
                14,
                53
            ],
                title: 'I Still See You',
                vote_average: 6.7,
                overview: 'A spellbinding and romantic supernatural thriller. Ten years after an apocalyptic event left the world haunted by ghosts, Roni receives a threatening message from beyond the grave. Joining forces with a mysterious classmate, Kirk, Roni descends into a shadow world that blurs the bounds of the living and the dead-and begins a desperate race against time to stop a cunning killer.',
                release_date: '2018-09-27',
                key: 6
        },
        7: {
            popularity: 19.05,
                id: 667,
                video: false,
                vote_count: 1053,
                vote_average: 6.6,
                title: 'You Only Live Twice',
                release_date: '1967-06-12',
                original_language: 'en',
                original_title: 'You Only Live Twice',
                genre_ids: [
                28,
                53,
                12
            ],
                backdrop_path: '/jahBdYTAGMJaEove9l9hzYpDKJD.jpg',
                adult: false,
                overview: 'A mysterious spacecraft captures Russian and American space capsules and brings the two superpowers to the brink of war. James Bond investigates the case in Japan and comes face to face with his archenemy Blofeld.',
                poster_path: '/7dnsJZniZK1Hbc9mOFDYa5W0dHi.jpg',
                key: 7
        },
        8: {
            popularity: 9.052,
                vote_count: 2147,
                video: false,
                poster_path: '/esfuYEvv7WrLvXNkCg7MCufEEdH.jpg',
                id: 6023,
                adult: false,
                backdrop_path: '/75ybu5PY5ujvghe1hbn5x1DdESl.jpg',
                original_language: 'en',
                original_title: 'P.S. I Love You',
                genre_ids: [
                18,
                10749
            ],
                title: 'P.S. I Love You',
                vote_average: 7.1,
                overview: 'A young widow discovers that her late husband has left her 10 messages intended to help ease her pain and start a new life.',
                release_date: '2007-11-15',
                key: 8
        },
        9: {
            popularity: 7.151,
                vote_count: 824,
                video: false,
                poster_path: '/8WdXpoFCEUReirxSn3SDAMXG1q5.jpg',
                id: 38303,
                adult: false,
                backdrop_path: '/vSNkowbsQTpP7nM8A99EuiYhRaJ.jpg',
                original_language: 'en',
                original_title: 'You Again',
                genre_ids: [
                35,
                10749
            ],
                title: 'You Again',
                vote_average: 6.2,
                overview: 'History -- make that high school -- may repeat itself when Marni learns that Joanna, the mean girl from her past, is set to be her sister-in-law. Before the wedding bells toll, Marni must show her brother that a tiger doesn\'t change its stripes. On Marni\'s side is her mother, while Joanna\'s backed by her wealthy aunt.',
                release_date: '2010-09-24',
                key: 9
        },
        10: {
            popularity: 46.749,
                vote_count: 649,
                video: false,
                poster_path: '/789DIwuuf7hACsXEFTTSR9H46ka.jpg',
                id: 565426,
                adult: false,
                backdrop_path: '/9LsJP9OuIBmBUxZpmVKtUUjF0PA.jpg',
                original_language: 'en',
                original_title: 'To All the Boys: P.S. I Still Love You',
                genre_ids: [
                35,
                10749
            ],
                title: 'To All the Boys: P.S. I Still Love You',
                vote_average: 6.9,
                overview: 'Lara Jean and Peter have just taken their romance from pretend to officially real when another recipient of one of her love letters enters the picture.',
                release_date: '2020-02-12',
                key: 10
        },
        11: {
            popularity: 13.251,
                vote_count: 8473,
                video: false,
                poster_path: '/MywWCQGJNUr5kivAQ7eseCG7rm.jpg',
                id: 640,
                adult: false,
                backdrop_path: '/ei0BdAPDALPp21OEZqknG43WOmO.jpg',
                original_language: 'en',
                original_title: 'Catch Me If You Can',
                genre_ids: [
                80,
                18
            ],
                title: 'Catch Me If You Can',
                vote_average: 7.9,
                overview: 'A true story about Frank Abagnale Jr. who, before his 19th birthday, successfully conned millions of dollars worth of checks as a Pan Am pilot, doctor, and legal prosecutor. An FBI agent makes it his mission to put him behind bars. But Frank not only eludes capture, he revels in the pursuit.',
                release_date: '2002-12-25',
                key: 11
        },
        12: {
            popularity: 6.973,
                vote_count: 231,
                video: false,
                poster_path: '/eaHH1hnbZ9wIUHjYKlqJUwpTBan.jpg',
                id: 9058,
                adult: false,
                backdrop_path: '/qhXZxM7WtnPev0IHsfpR9vPbiJo.jpg',
                original_language: 'en',
                original_title: 'Only You',
                genre_ids: [
                35,
                10749
            ],
                title: 'Only You',
                vote_average: 6.7,
                overview: 'A childhood incident has convinced Faith Corvatch that her true love is a guy named "Damon Bradley," but she has yet to meet him. Preparing to settle down and marry a foot doctor, Faith impulsively flies to Venice when it seems that she may be able to finally encounter the man of her dreams. Instead, she meets the charming Peter Wright. But can they fall in love if she still believes that she is intended to be with someone else?',
                release_date: '1994-09-17',
                key: 12
        },
        13: {
            popularity: 18.184,
                vote_count: 7475,
                video: false,
                poster_path: '/hU0E130tsGdsYa4K9lc3Xrn5Wyt.jpg',
                id: 291805,
                adult: false,
                backdrop_path: '/zrAO2OOa6s6dQMQ7zsUbDyIBrAP.jpg',
                original_language: 'en',
                original_title: 'Now You See Me 2',
                genre_ids: [
                28,
                35,
                53
            ],
                title: 'Now You See Me 2',
                vote_average: 6.8,
                overview: 'One year after outwitting the FBI and winning the public’s adulation with their mind-bending spectacles, the Four Horsemen resurface only to find themselves face to face with a new enemy who enlists them to pull off their most dangerous heist yet.',
                release_date: '2016-06-02',
                key: 13
        },
        14: {
            popularity: 9.269,
                vote_count: 444,
                video: false,
                poster_path: '/6IXVDZOpqThs3GTPix4ImwrTVb7.jpg',
                id: 1544,
                adult: false,
                backdrop_path: '/s1wez4YOL10BMVKwMANH7QMp19l.jpg',
                original_language: 'en',
                original_title: 'Imagine Me & You',
                genre_ids: [
                35,
                18,
                10749
            ],
                title: 'Imagine Me & You',
                vote_average: 7.3,
                overview: 'During her wedding ceremony, Rachel notices Luce in the audience and feels instantly drawn to her. The two women become close friends, and when Rachel learns that Luce is a lesbian, she realizes that despite her happy marriage to Heck, she is falling for Luce. As she questions her sexual orientation, Rachel must decide between her stable relationship with Heck and her exhilarating new romance with Luce.',
                release_date: '2005-02-01',
                key: 14
        },
        15: {
            popularity: 8.6,
                vote_count: 155,
                video: false,
                poster_path: '/3ESy6TiBPSYIbEES1zNspdYtMtw.jpg',
                id: 14114,
                adult: false,
                backdrop_path: '/t4r7p9gT2rN8ffoIRS6Ffv0ewCr.jpg',
                original_language: 'en',
                original_title: 'You Got Served',
                genre_ids: [
                18,
                10402
            ],
                title: 'You Got Served',
                vote_average: 5.4,
                overview: 'At Mr. Rad\'s Warehouse, the best hip-hop crews in Los Angeles compete for money and respect. But when a suburban crew crashes the party, stealing their dancers - and their moves - two warring friends have to pull together to represent the street. Starring hip-hop sensations Marques Houston, Omari Grandberry, Lil\' Kim and comedian Steve Harvey.',
                release_date: '2004-01-30',
                key: 15
        },
        16: {
            popularity: 8.385,
                id: 1819,
                video: false,
                vote_count: 832,
                vote_average: 5.5,
                title: 'You, Me and Dupree',
                release_date: '2006-07-14',
                original_language: 'en',
                original_title: 'You, Me and Dupree',
                genre_ids: [
                35,
                10749
            ],
                backdrop_path: '/dElx5Fp68tAEa5qr30VhqwWBiHn.jpg',
                adult: false,
                overview: 'After standing in as best man for his longtime friend Carl Petersen, Randy Dupree loses his job, becomes a barfly and attaches himself to the newlywed couple almost permanently -- as their houseguest. But the longer Dupree camps out on their couch, the closer he gets to Carl\'s bride, Molly, leaving the frustrated groom wondering when his pal will be moving out.',
                poster_path: '/mtdjrysC3phP4ZtCjdTJsHfZtIU.jpg',
                key: 16
        },
        17: {
            popularity: 9.164,
                vote_count: 124,
                video: false,
                poster_path: '/BziuuZULnGmTRLthEty1QdKSEo.jpg',
                id: 405177,
                adult: false,
                backdrop_path: '/kCzGGhFJ4kNxZCS7lETAXp7MzJ.jpg',
                original_language: 'en',
                original_title: 'Where\'d You Go, Bernadette',
                genre_ids: [
                35,
                18,
                9648
            ],
                title: 'Where\'d You Go, Bernadette',
                vote_average: 6.5,
                overview: 'When architect-turned-recluse Bernadette Fox goes missing prior to a family trip to Antarctica, her 15-year-old daughter Bee goes on a quest with Bernadette\'s husband to find her.',
                release_date: '2019-08-16',
                key: 17
        },
        18: {
            popularity: 6.297,
                id: 94478,
                video: false,
                vote_count: 54,
                vote_average: 7,
                title: 'You Instead',
                release_date: '2011-09-16',
                original_language: 'en',
                original_title: 'You Instead',
                genre_ids: [
                10402,
                35,
                10749
            ],
                backdrop_path: '/hW7HzywwbVRbOfZg3ULKKq0P3Hu.jpg',
                adult: false,
                overview: 'Two feuding rock stars get handcuffed together for 24 hours at a music festival where they are both due to perform.',
                poster_path: '/bXkV9LvIExVf2Sj7Xlv8La08flT.jpg',
                key: 18
        },
        19: {
            popularity: 11.296,
                vote_count: 269,
                video: false,
                poster_path: '/8qE8NZjiP2M884baH0VoLF828Vp.jpg',
                id: 490003,
                adult: false,
                backdrop_path: '/yrepQdpreOorLyBJyvZkGn3Izfe.jpg',
                original_language: 'en',
                original_title: 'Won\'t You Be My Neighbor?',
                genre_ids: [
                99
            ],
                title: 'Won\'t You Be My Neighbor?',
                vote_average: 8.3,
                overview: 'Fred Rogers used puppets and play to explore complex social issues: race, disability, equality and tragedy, helping form the American concept of childhood. He spoke directly to children and they responded enthusiastically. Yet today, his impact is unclear. Have we lived up to Fred\'s ideal of good neighbors?',
                release_date: '2018-06-08',
                key: 19
        }
    }
};

export default App;
