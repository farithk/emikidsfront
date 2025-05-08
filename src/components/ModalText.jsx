import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './ModalText.css'

function ModalText({ stage }) {

  return (
    <div className='modal_container'>
        <div className='modal_content'>
          <p className='modal_content_Info'>Estamos generando la imagen del {stage}</p>
          <p className='modal_content_subInfo'>Esto puede tomar un poco de tiempo...</p>
          <CircularProgress size={50} />
        </div>   
    </div>
  )
}

export default ModalText
