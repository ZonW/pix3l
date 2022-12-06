
import React from "react";
import "./Modal.css";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';
import noImage from '../img/noimg.jpeg';
import TrainerContext from '../TrainerContext';

const useStyles = makeStyles({
    card: {
        // maxWidth: 250,
        // height: 'auto',
        zIndex:9999,
        width: 300,
        height: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
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

function Modal({ props }) {
    const classes = useStyles();
    console.log(props);
    const pokemon = props[1];
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            props[0](false);
                        }}
                    >
                        X
                    </button>
                </div>
                {/* <div className="title">
                    <h1>HaHa, see what you find</h1>
                </div> */}
                <div className="body">
                    <Card className={classes.card} variant='outlined' >
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={pokemon.sprites && pokemon.sprites.front_default ? pokemon.sprites.front_default : noImage}
                                title='pokemon image'
                            />

                            <CardContent>
                                <Typography
                                    className={classes.titleHead}
                                    gutterBottom
                                    variant='h6'
                                    component='h2'
                                    color='textSecondary'
                                >
                                    {pokemon.species.name}
                                </Typography>
                            </CardContent>

                        </CardActionArea>
                    </Card>
                </div>
                <div className="footer">
                    <button
                        onClick={() => {
                            props[0](false);
                        }}
                        id="cancelBtn"
                    >
                        Cancel
                    </button>
                    <button>Continue</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;