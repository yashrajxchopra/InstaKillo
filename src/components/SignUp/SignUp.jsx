import React, { useState } from 'react'
import './index.css'
import axios from 'axios';
import logo from '../LogIn/logo.png'

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullname] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const API_URL= import.meta.env.VITE_API_URL;
    const navigate  = useNavigate();
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
          const response = await axios.post(`${API_URL}/api/register`, { email, fullName, username, password });
          console.log(response.data);
          toast.success('User registered successfully!',{
            autoClose: 3000
            });
          navigate('/login');
          
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

           <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username} required placeholder='Username'onChange={(event) => setUsername(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={fullName} required placeholder='Full Name' onChange={(event) => setFullname(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                 type={showPassword ? "text" : "password"}  value={password} required placeholder="Password" onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
               onClick={handleSubmit} 
               type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a  href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>

        </div>
      </div>
    // <div className="container">
    // <div className='input-div'>
    // <h3>InstaKillo</h3>
    //     <input type="email" className='inputText'value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}/>
    //     <input type="text" className='inputText' value={username} required placeholder='Username' onChange={(event) => setUsername(event.target.value)}/>
    //     <input type="text" className='inputText' value={fullName} required placeholder='Fullname' onChange={(event) => setFullname(event.target.value)}/>
    //     <input type={showPassword ? "text" : "password"} className='inputText' value={password} required placeholder='Password'onChange={(event) => setPassword(event.target.value)}/>
    //     <input type="checkbox"  onClick={togglePasswordVisibility} />
    //     <span>Already have an account?<a href="/login"> Login</a></span>
    //     <button className='submit-btn'onClick={handleSubmit}>Sign Up</button>
    // </div>
    // </div>
  )
}
