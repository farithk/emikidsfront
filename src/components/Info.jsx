import React from 'react';
import cucuLogo from '../assets/cuculogo.png';
import cucuLogo01 from '../assets/cucuLogo01.png';
import cucuLogo02 from '../assets/cucuLogo02.png';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import './Info.css'

function Info() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const pathToRender = location.pathname;
  
  return (
    <div className='header_container'>
        <div className='header_logo'>
          <img height={50} src={cucuLogo02} alt="" />
        </div>
        {
          email !== null && 
          <div className='header_options_container'>
            <div className='header_options'>
              <Link className='header_option_link' to={pathToRender === '/mystories' ? `/story?email=${email}`:`/mystories?email=${email}`}>{pathToRender === '/mystories' ? "Crear Historia":"Mis Historias"}</Link>
            </div>
          </div>
        }
        
          
    </div>
  )
}

export default Info
