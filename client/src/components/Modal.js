
import React, {useContext, useState} from 'react';
import "../App.css";
import { Card, CardActionArea, CardContent, CardMedia, Typography, makeStyles, Button } from '@material-ui/core';
import noImage from '../img/na.jpeg';
import {AuthContext} from '../firebase/Auth';
import axios from 'axios';

const useStyles = makeStyles({
    card: {
        // maxWidth: 250,
        // height: 'auto',
        zIndex: 1,
        width: 300,
        height: 450,
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
    },
    

});

function Modal({ props }) {
    const classes = useStyles();
    console.log(props);
    const img = props[1];
    

    const {currentUser} = useContext(AuthContext);
    const [ likeNum, setLikeNum ] = useState(img.likes.length);
    let tmp;
    if (currentUser) {
        if (img.likes.indexOf(currentUser.uid) === -1){
            tmp = false;
        } else {
            tmp = true;
        }
    } else {
        tmp = false;
    }
    
    const [ whetherLike, setWhetherLike ] = useState(tmp);
    
    const like = async (e) => {
        e.preventDefault();
        try {
            await axios({
                method: 'post',
                url: '//www.pix3l.art/api/likeImage',
                data:  {
                    userId: img.firebaseId, 
                    likerId: currentUser.uid, 
                    imageId: img.id
                }
              });
            if (whetherLike){
                setLikeNum(likeNum - 1);
                setWhetherLike(false);
            } else {
                setLikeNum(likeNum + 1);
                setWhetherLike(true);
            }

        } catch (err) {
            console.log(err);
        }	
    };

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
                <div className="body">
                    <Card className={classes.card} variant='outlined' >
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={img.url ? img.url : noImage}
                                title='AI image'
                            />

                            <CardContent>
                                <Typography
                                    className={classes.titleHead}
                                    gutterBottom
                                    variant='h6'
                                    component='h2'
                                    color='textSecondary'
                                >
                                </Typography>
                            </CardContent>
                            Style: {img.style}
                            <br />
                            Text: {img.text}
                            <br />
                            <img
                                    alt='likes'
                                    src='/imgs/like.png'
                                />
                                 {likeNum}
                        </CardActionArea>
                    </Card>
                </div>
                <div className="footer">
                    

                    {currentUser && !whetherLike && <Button id='like' variant="outlined" color = 'secondary'
                        onClick={like}> Like
                    </Button>}
                    {currentUser && whetherLike && <Button id='unlike' variant="contained" color = 'secondary'
                        onClick={like}> Unlike
                    </Button>}

                    <br></br>
                    <button
                        onClick={() => {
                            props[0](false);
                        }}
                        id="cancelBtn"
                    >
                        Close
                    </button>


                </div>
            </div>
        </div>
    );
}

export default Modal;