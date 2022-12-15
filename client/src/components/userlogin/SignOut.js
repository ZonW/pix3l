
import {doSignOut} from '../../firebase/FirebaseFunctions';
import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';

const SignOutButton = () => {

  const {currentUser} = useContext(AuthContext);

  if (currentUser) {

    return (
      <button type='button' onClick={doSignOut}>
        Sign Out
      </button>
    );

  } else {

    return <Navigate to='/gallery/1' />;

  }
  
};

export default SignOutButton;
