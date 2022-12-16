
import {doSignOut} from '../../firebase/FirebaseFunctions';
import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import { Button , TextField} from '@material-ui/core';

const SignOutButton = () => {

  const {currentUser} = useContext(AuthContext);

  if (currentUser) {

    return (
      <><p> Are you sure to log out...</p>
      <br>
      </br>
      <Button variant="contained" color='primary' onClick={doSignOut}>Log Out</Button></>
    );

  } else {

    return <Navigate to='/gallery/1' />;

  }
  
};

export default SignOutButton;
