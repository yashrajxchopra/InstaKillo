import React, { useState } from 'react'
import './index.css'
import axios from 'axios';

import { toast } from 'react-toastify';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullname] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    //const history = useHistory();
    const handleSubmit = async () => {
        try {
          if(email == ''){
            toast.error("Enter Email");
            return;
          }
          if(password == ''){
            toast.error("Enter Password");
            return;
          }if(fullName == ''){
            toast.error("Enter Name");
            return;
          }
          if(password.length < 6){
            toast.error("Password lenght should greater than 6");
            return;
          }
          const response = await axios.post('http://localhost:5000/api/register', { email, fullName, username, password });
          console.log(response.data);
          toast.success('User registered successfully!',{
            autoClose: 3000
            });
          
        } catch (error) {
          if (error.response.data.error) {
            toast.error(error.response.data.error);
          } else if (error.request) {
            toast.error("Network error occurred!");
          } else {
            toast.error("Error occurred while processing request!");
          }
        }
      }
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };;
  return (
    <div className="container">
    <div className='input-div'>
    <h3>InstaKillo</h3>
        <input type="email" className='inputText'value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/>
        <input type="text" className='inputText' value={username} required placeholder='Username' onChange={(event) => setUsername(event.target.value)}/>
        <input type="text" className='inputText' value={fullName} required placeholder='Fullname' onChange={(event) => setFullname(event.target.value)}/>
        <input type={showPassword ? "text" : "password"} className='inputText' value={password} required placeholder='Password'onChange={(event) => setPassword(event.target.value)}/>
        <input type="checkbox"  onClick={togglePasswordVisibility} />
        <span>Already have an account?<a href="/login"> Login</a></span>
        <button className='submit-btn'onClick={handleSubmit}>Sign Up</button>
    </div>
    </div>
  )
}
