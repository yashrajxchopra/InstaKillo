import React, { useState } from 'react'
import "./index.css"
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async () => {
        try {
          if(email == ''){
            toast.error("Enter Email");
            return;
          }
          if(password == ''){
            toast.error("Enter Password");
            return;
          }
          const response = await axios.post('http://localhost:5000/api/login', { email, password });
          toast.success("Login Successful!");
          const { token } = response.json();
          localStorage.setItem('token', token);
          console.log(response.data);
          
        } catch (error) {
          if (error.response) {
            console.log(error.response.data.error);
            toast.error(error.response.data.error);
          } else if (error.request) {
            console.log('Network error occurred');
            toast.error("Network error occurred!");
          } 
          else {
            console.log(error);
            toast.error(error.response.data.error);
          }
        }
    }
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div className="container">
      <div className='login-div'>
    <h3>InstaKillo</h3>
    <form >
        <label htmlFor="username"></label>
        <input type="text" className='inputText' value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/><br/>
        <div className="password-input-container">
          <input type={showPassword ? "text" : "password"}  className='inputText' value={password} required placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
          <input type="checkbox"  onClick={togglePasswordVisibility} />
        </div>
        <span>Don't have an account?<a href="/signup"> Signup</a></span>
        <button type="button" onClick={handleSubmit}>Log In</button>
    </form>
    </div>
    </div>
  )
}
