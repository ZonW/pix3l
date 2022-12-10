import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import noImage from '../img/noimg.jpeg';
import Modal from "./Modal";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button, Box } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        zIndex: 1,
        maxWidth: 250,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row'
    },
    media: {
        height: '100%',
        width: '100%'
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12
    }
    // modal: {
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: 400,
    //     bgcolor: 'background.paper',
    //     border: '2px solid #000',
    //     boxShadow: 24,
    //     p: 4,
    // }

});



function TryPokemonList() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    // const [searchData, setSearchData] = useState(undefined);
    const [pokeData, setpokeData] = useState(undefined);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [trainer, setTrainer] = useContext(TrainerContext);
    // const [showNext, setShowNext] = useState(true);
    // const [showPrevious, setShowPrevious] = useState(true);
    const [showNotFound, setShowNotFound] = useState(false);
    // const { pagenum } = useParams();

    let card = null;

    // let disPatch = useDispatch();
    // const CatchPokemon = pokemon => {
    //     disPatch(actions.catchThePokemon(trainer.id, pokemon.id, setTrainer));
    // };
    // const ReleasePokemon = pokemon => {
    //     disPatch(actions.releaseThePokemon(trainer.id, pokemon.id, setTrainer));
    // };

    const [modalOpen, setModalOpen] = useState(false);
    const [p, setP] = useState(undefined);

    useEffect(() => {
        // async function fetchData() {
        //     try {
        //         setShowNotFound(false);
        //         if (!/^\d+$/.test(pagenum)) {
        //             setShowNotFound(true);
        //             console.log('The pagenum format wrong');
        //         } else {
        //             const { data } = await axios.get(`/pokemon/page/${pagenum}`);
        //             setpokeData(data);
        //         }
        //         setLoading(false);
        //     } catch (e) {
        //         setShowNotFound(true);
        //         setLoading(false);
        //         console.log(e);
        //     }
        // }


        async function fetchData() {
            try {
                setShowNotFound(false);
                const { data} = await axios.get('/api/userImage/XXYYUUOO');
                console.log(data);
                let images = data.images
                setpokeData(images);
                setLoading(false);
            } catch (e) {
                setShowNotFound(true);
                setLoading(false);
                console.log(e);
            }
        }

        // async function checkPagination() {
        //     try {
        //         if (pagenum === '0') {
        //             setShowPrevious(false);
        //         } else {
        //             setShowPrevious(true);
        //         }

        //         const { data } = await axios.get(`/pokemon/page/${Number(pagenum) + 1}`);
        //         if (data.length >= 0) {
        //             setShowNext(true);
        //         } else {
        //             setShowNext(false);
        //         }
        //     } catch (e) {
        //         setShowNext(false);
        //         console.log(e);
        //     }
        // }

        fetchData();
        // checkPagination();
    }, []);//[pagenum]

    // useEffect(() => {
    //     console.log('search useEffect fired');
    //     async function fetchData() {
    //         try {
    //             setShowNotFound(false);
    //             console.log(`in fetch searchTerm: ${searchTerm}`);
    //             const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
    //             setSearchData([data]);
    //             setLoading(false);
    //         } catch (e) {
    //             setShowNotFound(true);
    //             console.log(e);
    //         }
    //     }
    //     if (searchTerm) {
    //         console.log('searchTerm is set');
    //         fetchData();
    //     }
    // }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    // const searchValue = async value => {
    //     setSearchTerm(value);
    // };

    const buildCard = img => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={img.id}>
                <Card className={classes.card} variant='outlined' >
                    <CardActionArea>
                        {/* <Link to={`/pokemon/${pokemon.id}`}> */}
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={img.url ? img.url : noImage}
                                title='user published image'
                            />

                            <CardContent>
                                <Typography
                                    className={classes.titleHead}
                                    gutterBottom
                                    variant='h6'
                                    component='h2'
                                    color='textSecondary'
                                >
                                    {/* {pokemon.species.name} */}
                                    style:{img.style}
                                    text:{img.text}
                                    likes:{img.likes}
                                </Typography>
                            </CardContent>
                        {/* </Link> */}
                    </CardActionArea>

                    <Button className='openModalBtn'
                        onClick={() => { setModalOpen(true); setP(img) }}> Show detail</Button>

                </Card>
            </Grid>
        );
    };

    // if (searchTerm) {
    //     card =
    //         searchData &&
    //         searchData.map(pokemon => {
    //             return buildCard(pokemon);
    //         });
    // } else {
        // card =
        //     pokeData &&
        //     pokeData.map(pokemon => {
        //         return buildCard(pokemon);
        //     });
    // }

    card =
    pokeData &&
    pokeData.map(img => {
        return buildCard(img);
    });


    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    } else {
        return (
            <div>
                {/* {!showNotFound && <Search searchValue={searchValue} />} */}
                <br />
                <br />
                {/* {showPrevious && !showNotFound && !searchTerm && (
                    <Link className='showlink' to={`/pokemon/page/${Number(pagenum) - 1}`}>
                        Previous
                    </Link>
                )}
                {showNext && !showNotFound && !searchTerm && (
                    <Link className='showlink' to={`/pokemon/page/${Number(pagenum) + 1}`}>
                        Next
                    </Link>
                )} */}
                <br />
                <br />
                {showNotFound && <p>404 No Pokemons Found</p>}


                {modalOpen && <Modal props={[setModalOpen, p]} />}
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
            </div>
        );
    }
}

export default TryPokemonList;



