import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import noImage from '../img/na.jpeg';
import Modal from "./Modal";
import Generate from './Generate';
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

});



function Gallery() {
    const classes = useStyles();
    const [ loading, setLoading] = useState(true);
    const [ generateData, setGenerateData] = useState(undefined);
    const [ pokeData, setpokeData] = useState(undefined);
    const [ generateTerm, setGenerateTerm] = useState('');
    const [ next, setNext ] = useState(true);
    const [ previous, setPrevious ] = useState(true);
    const [ outOfPage, setOutOfPage ] = useState(false);
    const [ badRequest, setBadRequest ] = useState(false);
    const [ generated, setGenerated] = useState(false);
    const [ showNotFound, setShowNotFound] = useState(false);
    const { pagenum } = useParams();

    const firstPage = 1;
    const lastPage = 10;

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

        async function fetchData() {
            try {
                setShowNotFound(false);
                const { data} = await axios.get('//www.pix3l.art/api/gallery');
                setpokeData(data);
                setLoading(false);
                if (Number(pagenum) === firstPage){
                    setPrevious(false);
					setNext(true);
                } else if (Number(pagenum) === lastPage){
                    setPrevious(true);
					setNext(false);
                } else if (Number(pagenum) > lastPage){
                    setOutOfPage(true);
                } else if (Number(pagenum) < firstPage){
                    setBadRequest(true);
                } else {
                    setPrevious(true);
					setNext(true);
                }
            } catch (e) {
                setShowNotFound(true);
                setLoading(false);
                console.log(e);
            }
        }


        fetchData();

    }, [pagenum]);

    useEffect(() => {
        console.log('generateTerm useEffect fired');
        console.log(`in fetch searchTerm: ${generateTerm}`);

        async function fetchData() {
            try {
                //setShowNotFound(false);
                console.log(`in fetch searchTerm: ${generateTerm}`);
                //const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
                //setSearchData([data]);
                setGenerated(true);
                //setLoading(false);
            } catch (e) {
                //setShowNotFound(true);
                console.log(e);
            }
        }
        if (generateTerm) {
            console.log('generateTerm is set');
            fetchData();
        }
    }, [generateTerm]); // eslint-disable-line react-hooks/exhaustive-deps


    const generateValue = async (value) => {
        setGenerateTerm(value);
      };

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


    card =
    pokeData &&
    pokeData.map(img => {
        return buildCard(img);
    });


    if (loading) {

		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
        if (outOfPage) {
			return (
				<div>
					<h2>404 : NO More Image Found</h2>
				</div>
			);
		} else if (badRequest) {
			return (
				<div>
					<h2>400 : Bad Request</h2>
				</div>
			);
		} else {
            if (!generateTerm) {
                return (
                    <div>
                        <Generate generateValue={generateValue} />
                        <br />
    
                        {previous  && <Link className="showlink" to={`/gallery/${Number(pagenum) - 1}`}> previous </Link>}
                        {" "} 
                        {<Link className="showlink" to={`/gallery/${Number(pagenum)}`}> {pagenum} </Link>}
                        {" "}
                        {next  && <Link className="showlink" to={`/gallery/${Number(pagenum) + 1}`}> next </Link>}
        
                        <br />
                        <br />
                        {modalOpen && <Modal props={[setModalOpen, p]} />}
                        <Grid container className={classes.grid} spacing={5}>
                            {card}
                        </Grid>
                    </div>
                );

            } else {
                return (
                    <div>
                        {generated  && <h2>Generating ...</h2>}
                        {generated  && <h2>Generated !!!</h2>}
                        {generated  && <div className="body">
                            <Card className={classes.card} variant='outlined' >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        component='img'
                                        image={'https://pix3lserver.s3.amazonaws.com/s3%3A//pix3lserver/public/image/temp/79df8145-60d0-4f64-ac3b-78dcae29fc2f.jpg'}
                                        title='AI image'
                                    />
            
                                </CardActionArea>
                            </Card>
                        </div>}
                        <br />
    
                        {previous  && <Link className="showlink" to={`/gallery/${Number(pagenum) - 1}`}> previous </Link>}
                        {" "} 
                        {<Link className="showlink" to={`/gallery/${Number(pagenum)}`}> {pagenum} </Link>}
                        {" "}
                        {next  && <Link className="showlink" to={`/gallery/${Number(pagenum) + 1}`}> next </Link>}
        
                        <br />
                        <br />
                        {modalOpen && <Modal props={[setModalOpen, p]} />}
                        <Grid container className={classes.grid} spacing={5}>
                            {card}
                        </Grid>
                    </div>
                );
            }
            
        }
    }
}

export default Gallery;