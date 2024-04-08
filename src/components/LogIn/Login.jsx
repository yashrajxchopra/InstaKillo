import React, { useState } from 'react'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/login', { email, password });
          const { token } = response.json();
          localStorage.setItem('token', token);
          console.log(response.data);
          
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data.error);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Network error occurred');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error occurred while processing request');
          }
        }
    }
  return (
    <div>
    <h3>Login</h3>
    <form >
        <label htmlFor="username">Username: </label>
        <input type="text" value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/><br/>
        <label htmlFor="password">Password: </label>
        <input type="password" value={password} required placeholder='Password'onChange={(event) => setPassword(event.target.value)}/><br/>
        <button type="button" onClick={handleSubmit}>Log In</button>
    </form>
    </div>
  )
}
