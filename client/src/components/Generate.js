import React, {useContext} from 'react';
import { Button } from '@material-ui/core';
import {Navigate} from 'react-router-dom';
import {useState} from 'react';
import {AuthContext} from '../firebase/Auth';

const Generate = (props) => {

    const [formData, setFormData] = useState(null);

	const {currentUser} = useContext(AuthContext);

	

    const saveChange = (e) => {
        //console.log(e.target.value);
        setFormData(e.target.value);
    };
    
    const handleChange = (e) => {
		if (!currentUser) {
			alert("need to sign in first");
			return <Navigate to='/signin' />;
		} else {
			props.generateValue(formData);
		}
    };
    return (
		<form
			method='POST '
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='center'
		>
			<label>
				<span>Keywords you want to generate: </span>
                <br/>
                <br/>
				<input autoComplete='off' type='text' name='generateTerm' onChange={(e) =>saveChange(e)} />
                <br/>
                <br/>
                <Button variant="contained" color = 'primary' onClick={handleChange} >Generate</Button>

			</label>
		</form>
	);
};

export default Generate;
