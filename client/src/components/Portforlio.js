import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import noImage from '../img/na.jpeg';
import Modal from "./Modal";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button, Box } from '@material-ui/core';
import { AuthContext } from '../firebase/Auth';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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
});



function FindUserAllImg() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [pokeData, setpokeData] = useState([]);
    // const [trainer, setTrainer] = useContext(TrainerContext);
    // const [showNext, setShowNext] = useState(true);
    // const [showPrevious, setShowPrevious] = useState(true);
    const [showNotFound, setShowNotFound] = useState(false);
    let card = null;
    const [modalOpen, setModalOpen] = useState(false);
    const [p, setP] = useState(undefined);
    const [flag, setfalg] = useState(false);
    const { currentUser } = useContext(AuthContext);

    // const {currentUser} = React.useContext(AuthContext);
    // const uid = currentUser.uid;
    const [uid, setUid] = useState(undefined)


    async function deleteHanld(id) {
        try {
            console.log("I am in deletehanld");
            console.log(`${id}`);
            const { data } = await axios.post('//www.pix3l.art/api/deleteImage', {
                userId: uid,
                imageId: id
            })
            if (data.length != 0) {
                setfalg(!flag);
            } else {
                console.log("check whether delete the img ")
            }
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {

        async function fetchData() {
            try {
                setShowNotFound(false);
                // const { data} = await axios.get('/api/userImage/XXYYUUOO');
                // const { data } = await axios.get('/api/userImage/XXYYUUOO');
                const { data } = await axios.get('//www.pix3l.art/api/getUser/' + currentUser.uid);
                setUid(currentUser.uid)
                // http://www.pix3l.art/api/getUser/qwerqwer
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

        fetchData();
        // checkPagination();
    }, [flag]);//[pagenum]

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

                    <Button className='deleteImg'
                        onClick={() => { deleteHanld(img.id) }}> delete</Button>

                </Card>
            </Grid>
        );
    };

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
    }
    else {
        // console.log(pokeData);
        return (
            <div>
                <br />
                <br />
                {pokeData.length == 0 &&
                    <div>
                        <h2>You should generate a picture first</h2>
                        <Link to="/gallery/1">Go TO Generate</Link>
                    </div>

                }
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

export default FindUserAllImg;




