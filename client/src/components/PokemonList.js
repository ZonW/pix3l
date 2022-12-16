import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions';
import SearchChar from './Search';

const useStyles = makeStyles({
	card: {
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
});
function CharList() {
	let {page} = useParams();
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ pokemonData, setPokemonData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
    const [overpage, setoverpage] = useState(false);
    const [showNext, setShowNext] = useState(true);
    const [showPrevious, setShowPrevious] = useState(true);
    const [showNotFound, setShowNotFound] = useState(false);
    const allTrainers = useSelector((state) => state.trainers);
	let card = null;
	
    
    useEffect(() => {

		async function fetchData() {
            if (1 <= Number(page)) {
                try {
                    setShowNotFound(false);
                    if (!(/^\d+$/.test(page))) {
                        setShowNotFound(true);
                    } else {
                        const { data } = await axios.get(`http://localhost:4000/pokemon/page/${page}`);
                        if (data.length === 0) {
                            setShowNotFound(true);
                            setLoading(false);
                        } else {
                            setPokemonData(data);
                            setLoading(false);
                        }
                    }
                } catch (e) {
                    setoverpage(true);
                }
            } else {
                setoverpage(true);
            }
		}

        async function checkPagination() {
            try {
                if (page === '1') {
                    setShowPrevious(false);
                } else {
                    setShowPrevious(true);
                }
                
                const {data} = await axios.get(`http://localhost:4000/pokemon/page/${page}`);
                if (data.results && data.results.length === 0) {
                    setShowNext(false);
                } else {
                    setShowNext(true);
                }

            } catch (e) {
                console.log(e);
            }
        }

		fetchData();
        checkPagination();
	}, [page]);


	useEffect(
		() => {
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://localhost:4000/pokemon/search/' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);



	const searchValue = async (value) => {
		setSearchTerm(value);
	};

    const dispatch = useDispatch();

    const catchPokemon = (id) => {
        dispatch(actions.catchPokemon(id));
    };
    
    const releasePokemon = (id) => {
        dispatch(actions.releasePokemon(id));
    };
    
 
	const buildCard = (pokemon) => {
        let disabled = false;
        let full = false;
        let id = pokemon.id;
        for (let i = 0; i < allTrainers.length; i++) {
            if (allTrainers[i].selected === true){
                if (allTrainers[i].pokemon && (allTrainers[i].pokemon).length >= 6){
                    full = true;
                }
                if (allTrainers[i].pokemon){
                    allTrainers[i].pokemon.forEach(element => {
                    if (element == id) {
                        disabled = true;
                    }
                    });
                }
            }
        }

        if (!full && !disabled){
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                    <Card className={classes.card} variant='outlined'>
                        <CardActionArea>
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={pokemon.image ? pokemon.image: noImage}
                                    title='character image'
                                />

                                <CardContent>
                                    <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                        {pokemon.name}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>
                    <button class="button1" onClick={() => catchPokemon(pokemon.id)}>Catch</button>
                </Grid>
            );
        }
        else if (!full && disabled) {
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                    <Card className={classes.card} variant='outlined'>
                        <CardActionArea>
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={pokemon.image ? pokemon.image: noImage}
                                    title='character image'
                                />

                                <CardContent>
                                    <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                        {pokemon.name}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>
                    <button class="button2" onClick={() => releasePokemon(pokemon.id)}>Release</button>
                </Grid>
            );
        }
        else if (full && !disabled){
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                    <Card className={classes.card} variant='outlined'>
                        <CardActionArea>
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={pokemon.image ? pokemon.image: noImage}
                                    title='character image'
                                />

                                <CardContent>
                                    <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                        {pokemon.name}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>
                    <button disable>Full</button>
                </Grid>
            );
        }
        else {
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                    <Card className={classes.card} variant='outlined'>
                        <CardActionArea>
                            <Link to={`/pokemon/${pokemon.id}`}>
                                <CardMedia
                                    className={classes.media}
                                    component='img'
                                    image={pokemon.image ? pokemon.image: noImage}
                                    title='character image'
                                />

                                <CardContent>
                                    <Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
                                        {pokemon.name}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>
                    <button class="button2" onClick={() => releasePokemon(pokemon.id)}>Release</button>
                </Grid>
            );
        }
	};

	if (searchTerm) {
		card =
			searchData &&
			[searchData].map((char) => {
				return buildCard(char);
			});
	} else {
		card =
			pokemonData &&
			pokemonData.map((char) => {
				return buildCard(char);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
                <SearchChar searchValue={searchValue} />
				<br />
				<br />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
                <br />
                {showPrevious && !showNotFound && !searchTerm && <Link className="showlink" to={`/pokemon/page/${Number(page) - 1}`}>
                    Previous
                </Link>}
    
                {showNext && !showNotFound && !searchTerm && <Link className="showlink" to={`/pokemon/page/${Number(page) + 1}`}>
                    Next
                </Link>}
                <br />
                <br />
                {showNotFound && <p>404 No More Pokemons</p>}
			</div>
		);
	}
};

export default CharList;