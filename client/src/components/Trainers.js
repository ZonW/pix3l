import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import AddTrainer from './AddTrainer';
import Trainer from './Trainer';

function Trainers() {
  const [addBtnToggle, setBtnToggle] = useState(false);
  const allTrainers = useSelector((state) => state.trainers);
  //console.log('allTrainers', allTrainers);
  return (
    <div className='todo-wrapper'>
      <h2>Trainers</h2>
      <button onClick={() => setBtnToggle(!addBtnToggle)}>Add A Trainer</button>
      <br />
      <br />
      <br />
      {addBtnToggle && <AddTrainer />}
      <br />
      {allTrainers.map((trainer) => {
        //console.log(trainer);
        return <Trainer key={trainer.id} trainer={trainer} />;
      })}
    </div>
  );
}

export default Trainers;