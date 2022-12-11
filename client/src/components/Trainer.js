
import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { Link,useParams } from 'react-router-dom';
import actions from '../actions';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import noImage from '../img/download.jpeg';
import axios from 'axios';

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

function Trainer(props) {
    
    let card = null;  
    let pokeList = [];
    let pokeArray = props.trainer.pokemon;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [ pokemonData, setPokemonData ] = useState(undefined);
    
    useEffect(() => {
		async function fetchData(pokeArray) {
            if(pokeArray){
                for (let i = 0; i < pokeArray.length; i++) {
                    const { data } = await axios.get(`http://localhost:4000/pokemon/${pokeArray[i]}`);
                    pokeList.push(data)
                }
                setPokemonData(pokeList);
            } else{
                setPokemonData('');
            }
        }
        fetchData(pokeArray);
    }, pokeArray);


    const deleteTrainer = () => {
        dispatch(actions.deleteTrainer(props.trainer.id));
    };

    const selectTrainer = () => {
        dispatch(actions.selectTrainer(props.trainer.id));
    };


    const buildCard = (pokemon) => {
        return (
            <Grid item xs={6} sm={3} md={2} lg={2} xl={1} key={pokemon.id}>
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
            </Grid>
        );
    };
   //console.log(pokeList)


   card =   pokemonData &&
            pokemonData.map((char) => {
                    return buildCard(char);
                    });
    
    if (props.trainer.selected){
        return (
            <div className='todo-wrapper'>
            <table>
                <tbody>
                <tr>
                    <td>Name:</td>
                    <td>{props.trainer.name}</td>
                </tr>
                </tbody>
            </table>
            <Grid container className={classes.grid} spacing={1}>
                {card}
            </Grid>
            <button disabled>Selected</button>
            </div>
        );
    } else{
        return (
            <div className='todo-wrapper'>
            <table>
                <tbody>
                <tr>
                    <td>Name:</td>
                    <td>{props.trainer.name}</td>
                </tr>
                </tbody>
            </table>
            <Grid container className={classes.grid} spacing={1}>
                {card}
            </Grid>
            <button onClick={selectTrainer}>Select Trainer</button>
            <button onClick={deleteTrainer}>Remove Trainer</button>
            </div>
        );
    }
}

export default Trainer;