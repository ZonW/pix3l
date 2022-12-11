import React from 'react';
import logo from './img/logo.jpg';
import './App.css';
import Gallery from './components/Gallery.js';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import Portforlio from './components/Portforlio.js';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            πx3l
          </h1>
          <Link className='showlink' to='/'>
            Gallery
          </Link>
          <Link className='showlink' to='/Portforlio'>
            Portforlio
          </Link>
          
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Gallery />} />
            <Route path='/portforlio' element={<Portforlio />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;