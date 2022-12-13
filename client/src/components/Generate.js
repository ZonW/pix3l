import React from 'react';
import { Button } from '@material-ui/core';

const Generate = (props) => {
  const handleChange = (e) => {
		props.searchValue(e.target.value);
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
				<input autoComplete='off' type='text' name='searchTerm' />
                <br/>
                <br/>
                <Button variant="contained" color = 'primary' onClick={handleChange} >Generate</Button>

			</label>
		</form>
	);
};

export default Generate;
