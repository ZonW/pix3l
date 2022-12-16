import React from 'react';
import {doSocialSignIn} from '../../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn('google')}
        alt='google signin'
        src='/imgs/google_signin.png'
      />
      <img
        onClick={() => socialSignOn('facebook')}
        alt='facebook signin'
        src='imgs/facebook_signin.png'
      />
    </div>
  );
};

export default SocialSignIn;
