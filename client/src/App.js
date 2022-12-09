import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import TrainerContext from './TrainerContext';
// import PokemonList from './Components/PokemonList';
// import Pokemon from './Components/Pokemon';
import Home from './Components/Home';
// import Trainers from './Components/Trainers'
import TryPokemonList from './Components/try';
// import Modal from './Components/Modal';
// import Backdrop from './Components/Backdrop';


function App() {

  // const allTrainers = useSelector((state) => state.trainers);
  // const [Trainer, setTrainer] = useState(allTrainers[0]);

  return (
    <Router>
      {/* <TrainerContext.Provider value={[Trainer, setTrainer]}> */}
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>
              Welcome to the Pokemon Application
            </h1>

            <br />
            <br />
{/* 
            <Link className='showlink' to='/'>
              Home
            </Link>
            &nbsp;&nbsp;&nbsp; */}

            {/* &nbsp;&nbsp;&nbsp;
            <Link className='showlink' to='/pokemon/page/0'>
              Pokemons
            </Link>
            &nbsp;&nbsp;&nbsp; */}

            &nbsp;&nbsp;&nbsp;
            <Link className='showlink' to='/api/usePage/XXYYUUOO'>
              TryPokemons
            </Link>
            &nbsp;&nbsp;&nbsp;
{/* 
            &nbsp;&nbsp;&nbsp;
            <Link className='showlink' to='/trainers'>
              Trainers
            </Link> */}
          </header>

          <br />
          <br />

          <div className='App-body'>
            <Routes>
              <Route path='/' element={<Home />} />
              {/* <Route path='/trainers' element={<Trainers />} />
              <Route path='/pokemon/page/:pagenum' element={<PokemonList />} />
              <Route path='/pokemon/:id' element={<Pokemon />} /> */}
              <Route path='/api/usePage/XXYYUUOO' element={<TryPokemonList />} />
            </Routes>
          </div>
        </div>
      {/* </TrainerContext.Provider> */}
    </Router>
  );
}

export default App;
