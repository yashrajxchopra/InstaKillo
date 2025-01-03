import React, { useEffect, useState } from 'react'
import "./index.css"
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import ConfirmBox from '../Profile/ConfirmBox';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const API_URL= import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
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
          const response = await axios.post(`${API_URL}/api/login`, { email, password });
          toast.success("Login Successful!");
          const token = response.data.token;
          localStorage.setItem('token', token);
          navigate('/')
          
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
    useEffect(() => {
      const login = async () => {
          try {
              const token = localStorage.getItem('token');
              if (token) {
                  const response = await axios.post(`${API_URL}/api/NoInputLogin`, {}, {
                      headers: {
                          'Authorization': `Bearer ${token}` 
                      }
                  });
                  console.log(response)
                  navigate('/');
              }
              else{
                
              }
          } catch (error) {
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                  toast.error("Session expired or invalid token, please login again!");
                  localStorage.removeItem('token');
              } else {
                  // Handle other errors, e.g., server issues, network errors, etc.
                  toast.error("Error occurred while processing request!");
                  console.error("Error details:", error);
              }
          }
      };
  
      if(localStorage.getItem('token')){
        login(); 
      }
  }, []);
  
  return (
    <>
    <div className='bg-black w-full h-screen overflow-hidden'>
  
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Instakillo"
            src={logo}
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email} required placeholder='Email'onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="block text-white bg-gray-900 w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                 type={showPassword ? "text" : "password"}  value={password} required placeholder="Password" onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="block text-white bg-gray-900 w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="text-sm flex justify-end mt-2">
                  <a href="#" onClick={()=>setIsResetOpen(true)} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                  {isResetOpen && <ConfirmBox handleSubmit={()=>setIsResetOpen(false) } setIsConfirmOpen={setIsResetOpen} textToDisplay={"Contact me at yashrajxchopra@gmail.com to reset password."} loading={false}/>}
                </div>
            </div>

            <div>
              <button
               onClick={handleSubmit} 
               type="button"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
      </div>
    </>
  )
}
