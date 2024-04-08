import React, { useState } from 'react'
import './index.css'
import axios from 'axios';
import useShowToast from '../../hooks/useShowToast';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const showToast = useShowToast();
    showToast('YC', 'hello', 'toast');
    const handleSubmit = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/register', { email, username, password });
          console.log(response.data);
          setErrorMessage('');
          showToast('User registered successfully');
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setErrorMessage(error.response.data.error);
          } else if (error.request) {
            // The request was made but no response was received
            setErrorMessage('Network error occurred');
          } else {
            // Something happened in setting up the request that triggered an Error
            setErrorMessage('Error occurred while processing request');
          }
        }
      };
  return (
    <div className="sign-container">
    <div className='input-div'>
        <input type="email" value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/>
        <input type="text" value={username} required placeholder='Username' onChange={(event) => setUsername(event.target.value)}/>
        <input type="password" value={password} required placeholder='Password'onChange={(event) => setPassword(event.target.value)}/>
        <button className='submit-btn'onClick={handleSubmit}>Sign Up</button>
        {errorMessage?(<h3>{errorMessage}</h3>):('')}
    </div>
    </div>
  )
}
