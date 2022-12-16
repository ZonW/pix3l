import React, {useContext} from 'react';
import SocialSignIn from './SocialSignIn';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from '../../firebase/FirebaseFunctions';
import { Button , TextField} from '@material-ui/core';

function SignIn() {

  const {currentUser} = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };

  if (currentUser) {
    return <Navigate to='/gallery/1' />;
  } else {
    return (
      
      <div>
        <h1>Log in</h1>
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <label>

               <TextField sx={{ m: 1, width: '100ch' }} id="email"  variant="outlined"  className='form-control'
                helperText="Please enter your email"
                  label="Email:"

                  name='email'
                  type='email'
                  placeholder='Email'
                  autoComplete='off'
                  required/>
            </label>
          </div>
          <div className='form-group'>
            <label>

             <TextField sx={{ m: 0, width: '10' }} id="password"  variant="outlined"  className='form-control'
            helperText="Please enter your password"
            label="Password:"
            name='password'
            type='password'
            placeholder='Password:'
            autoComplete='off'
            required/>
            </label>
          </div>

          <br></br>

          <Button variant="contained" color = 'primary'  type='submit' >Log in</Button>
          {" "}

          <Button variant="contained" color = 'primary' className='forgotPassword' onClick={passwordReset} >Forgot Password</Button>
  
        </form>
  
        <br />
        <SocialSignIn />
      </div>
    );
  }
  
}

export default SignIn;
