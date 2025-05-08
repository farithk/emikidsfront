import React from 'react';
import cucuLogo from '../assets/cuculogo.png';
import './Info.css'

function Info() {

  return (
    <div className='header_container'>
        <div className='header_logo'>
          <img height={30} src={cucuLogo} alt="" />
        </div>
        <div className='header_options'>
          <p>Nuestro Equipo</p>
        </div>   
    </div>
  )
}

export default Info
