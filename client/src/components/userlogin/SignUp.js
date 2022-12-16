import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../../firebase/FirebaseFunctions';
import {AuthContext} from '../../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import { Button , TextField} from '@material-ui/core';

function SignUp() {

  const {currentUser} = useContext(AuthContext);

  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
  

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName
      );
      
    } catch (error) {
      alert(error);
    }
  };


  if (currentUser) {
    return <Navigate to='/gallery/1' />;
  }

  return (

    <div>
      <h1>Sign up</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <label>

            <TextField sx={{ m: 1, width: '100ch' }} id="name"  variant="outlined"  className='form-control'
            helperText="Please enter your name"

              label="Name:"
              name='displayName'
              type='name'
              placeholder='Name'
              autoComplete='off'
              required/>
          </label>
        </div>
        <div className='form-group'>
          <label>
            
             <TextField sx={{ m: 1, width: '100ch' }} id="outlined-basic"  variant="outlined"  className='form-control'
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

             <TextField sx={{ m: 1, width: '100ch' }} id="outlined-basic"  variant="outlined"  className='form-control'
            helperText="Please enter your password"
              label="Password:"
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required/>

          </label>  
        </div>
  
        <div className='form-group'>
          <label>
           
            <TextField  id="outlined-basic"  variant="outlined"  className='form-control'
            helperText="Please re-enter your password"
              label="Confirm Password:"
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required/>

          </label>
          
        </div>
        <br></br>

        <Button variant="contained" color = 'primary'  type='submit' >Sign Up</Button>
      

      </form>
      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignUp;
