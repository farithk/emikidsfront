import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { enterByEmail } from "../services/apiService";
import Button from '@mui/material/Button';
import Input from '@mui/joy/Input';

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
    console.log(e);
    
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
      <form onSubmit={handleSubmit} className='email_container'>
        <div>
          <label htmlFor="email">Tu correo Electronico:</label>
          <Input
            className='email_container_input'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="pepito@gmail.com"
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
