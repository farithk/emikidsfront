import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { enterByEmail } from "../services/apiService";
import cucuLogo02 from '../assets/cucuLogo02.png';
import Button from '@mui/material/Button';
import Input from '@mui/joy/Input';
import Info from './Info.jsx';
import TextField from '@mui/material/TextField';

import './Home.css'

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // State to manage the email input
  const [error, setError] = useState(""); // State to manage the error message

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear the error message when the input changes
  };

  const validateEmail = (email) => {
    // Simple email regex pattern for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the email when submitting
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError(""); // Clear error if valid email
      navigate(`/story?email=${email}`); // Redirige programáticamente
      // Add further logic for successful submission
    }
  };

  return (
    <div className='root'>
      <Info email={email}></Info>
      <div className='home_title_container'>
        <img className='home_image_inner' src={cucuLogo02} alt="" />
      </div>
      <p className='home_title_text'>
        Llevemos CUCÚ a miles de estudiantes en América Latina y el mundo para que descubran el poder de contar historias.
      </p>
      
      <form onSubmit={handleSubmit} className='email_container'>
        <div>
          <label className='title_home_login'>Ayudanos a probar nuestra primer versión</label>
          <TextField
            className='email_container_input'
            value={email}
            onChange={handleChange}
            required
            type='email'
            placeholder="pepito@gmail.com"
            sx={{
              marginTop: '20px',
              width: '100%',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bdddff',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#bdddff',
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#87bff8',
                  borderWidth: '3px',
                },
              },
            }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
        <br />
        <Button
          variant="outlined"
          type="submit"
        >
          Vamos a crear juntos!!
        </Button>
      </form>
    </div>
  )
}

export default Home;
