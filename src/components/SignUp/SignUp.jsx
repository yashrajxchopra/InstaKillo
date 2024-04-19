import React, { useState } from 'react'
import './index.css'
import axios from 'axios';

import { toast } from 'react-toastify';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullname] = useState('');
    const history = useHistory();
    const handleSubmit = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/register', { email, fullName, username, password });
          console.log(response.data);
          toast.success('User registered successfully!',{
            autoClose: 3000
            });
          
        } catch (error) {
          if (error.response) {
            toast.error('Error Occured!');
          } else if (error.request) {
            toast.error("Network error occurred!");
          } else {
            toast.error("Error occurred while processing request!");
          }
        }
      };
  return (
    <div className="sign-container">
    <div className='input-div'>
        <input type="email" value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/>
        <input type="text" value={username} required placeholder='Username' onChange={(event) => setUsername(event.target.value)}/>
        <input type="text" value={fullName} required placeholder='Fullname' onChange={(event) => setFullname(event.target.value)}/>
        <input type="password" value={password} required placeholder='Password'onChange={(event) => setPassword(event.target.value)}/>
        <button className='submit-btn'onClick={handleSubmit}>Sign Up</button>
    </div>
    </div>
  )
}
