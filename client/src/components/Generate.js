import React from 'react';
import { Button } from '@material-ui/core';
import {useState} from 'react';

const Generate = (props) => {

    const [formData, setFormData] = useState(null);

    const saveChange = (e) => {
        //console.log(e.target.value);
        setFormData(e.target.value);
    };
    
    const handleChange = (e) => {
	    props.generateValue(formData);
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
