import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import noImage from '../img/na.jpeg';
import Modal from "./Modal";
import Generate from './Generate';
import {Navigate} from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button, Box } from '@material-ui/core';

import {AuthContext} from '../firebase/Auth';

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
    const [ generateData, setGenerateData] = useState(null);
    const [ pokeData, setpokeData] = useState(undefined);
    const [ generateTerm, setGenerateTerm] = useState('');
    const [ style, setStyle] = useState('');
    const [ next, setNext ] = useState(true);
    const [ previous, setPrevious ] = useState(true);
    const [ outOfPage, setOutOfPage ] = useState(false);
    const [ badRequest, setBadRequest ] = useState(false);
    const [ generated, setGenerated] = useState(false);
    const [ showNotFound, setShowNotFound] = useState(false);
    const { pagenum } = useParams();

    const firstPage = 1;
    const lastPage = 6;

    let card = null;

    const {currentUser} = useContext(AuthContext);


    const [modalOpen, setModalOpen] = useState(false);
    const [p, setP] = useState(undefined);

    useEffect(() => {

        async function fetchData() {

            try {
                setShowNotFound(false);
                if (currentUser) {
                    console.log(currentUser.uid);
                    await axios.post('//www.pix3l.art/api/newUser/' + currentUser.uid);
                }
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
        console.log(`in fetch generateTerm: ${generateTerm}`);

        async function fetchData() {
            try {

                console.log(`in fetch generateTerm: ${generateTerm}`);
                console.log(`style: ${style}`);
                if (generateTerm && style){
                    const url = "http://www.pix3l.art/api/generate?style=" + style + "&text=" + generateTerm;
                    const {data} = await axios.get(url);
                    console.log(data);
                    setGenerateData(data);
                    setGenerated(true);
                    console.log(`in fetch generateTerm: ${generateTerm}`);
                    console.log(`style: ${style}`);
                }

            } catch (e) {

                console.log(e);
            }
        }
        if (generateTerm) {
            console.log('generateTerm is set');
            fetchData();
        }
    }, [generateTerm]); // eslint-disable-line react-hooks/exhaustive-deps


    const generateValue = async (value) => {
        setGenerateTerm(value.text);
        setStyle(value.style);
      };

    const buildCard = img => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={img.id}>
                <Card className={classes.card} variant='outlined' >
                    <CardActionArea>
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
        
                                    style:{img.style}
                                    text:{img.text}
                                    likes:{img.likes}
                                </Typography>
                            </CardContent>
                   
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

    if (pagenum === undefined){
        return <Navigate to='/gallery/1' />;
    }

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
    
                        {previous  && <Link className="showlink" to={`/gallery/${Number(pagenum) - 1}`}> {'<'} </Link>}
                        {" "} 
                        {<Link className="showlink" to={`/gallery/${Number(pagenum)}`}> {pagenum} </Link>}
                        {" "}
                        {next  && <Link className="showlink" to={`/gallery/${Number(pagenum) + 1}`}> {'>'} </Link>}
        
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
                        {!generated  && <h2>Generating ...</h2>}
                        {!generated  && <h4>It may take a while...</h4>}
                        {generated  && <h2>Generated !!!</h2>}
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                        {generated  && 
                        <Grid container spacing={3} >
                            <Card className={classes.card} variant='outlined' >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        component='img'
                                        image={generateData[0].url}
                                        title='AI image'
                                    />
            
                                </CardActionArea>
                                <Button variant="contained"  >Add</Button>
                            </Card>
                            <Card className={classes.card} variant='outlined' >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        component='img'
                                        image={generateData[1].url}
                                        title='AI image'
                                    />
            
                                </CardActionArea>
                                <Button variant="contained"  >Add</Button>
                            </Card>
                            
                            <Card className={classes.card} variant='outlined' >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        component='img'
                                        image={generateData[2].url}
                                        title='AI image'
                                    />
            
                                </CardActionArea>
                                <Button variant="contained"  >Add</Button>
                            </Card>
                            <Card className={classes.card} variant='outlined' >
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        component='img'
                                        image={generateData[3].url}
                                        title='AI image'
                                    />
            
                                </CardActionArea>
                                <Button variant="contained"  >Add</Button>
                            </Card>
                        </Grid>
                        }
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <Generate generateValue={generateValue} />
                        <br />
                        <br />
                        <br />

    
                        {previous  && <Link className="showlink" to={`/gallery/${Number(pagenum) - 1}`}> {'<'} </Link>}
                        {" "} 
                        {<Link className="showlink" to={`/gallery/${Number(pagenum)}`}> {pagenum} </Link>}
                        {" "}
                        {next  && <Link className="showlink" to={`/gallery/${Number(pagenum) + 1}`}> {">"} </Link>}
        
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