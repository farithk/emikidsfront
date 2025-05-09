import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Info from './Info.jsx';
import ModalText from './ModalText.jsx';
import tommyAvatar from '../assets/cucuFrog.png';

import { extractTaggedContent, formatFixTags, removeFixTags } from '../utils/extractTagsFromPrompt.js';

import {
  getStoriesByEmail,
  getQuestionsFromAgent,
  saveStory,
  saveStages,
  generateFirstImage,
  generateFollowedImage
} from "../services/apiService";

import './Story.css'

function Home() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [ stories, setStories ] = useState([]);
  const [ stage, setStage ] = useState('inicio');

  const [ agentResponse, setAgentResponse ] = useState('');
  const [ agentQuestion, setAgentQuestion ] = useState('¿Cómo inicia la historia?');
  const [ userActualStory, setUserActualStory ] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [ textValueToResponse, setTextValueToResponse ] = useState('');

  const [ loading, setLoading ] = useState(true);
  const [ loadingAnswer, setLoadingAnswer ] = useState(false);
  const [ loadingImage, setLoadingImage ] = useState(false);

  const [ storyIdSaved, setStoryIdSaved ] = useState('');

  const [ storyTitle, setStoryTitle ] = useState('');

  const handleResize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    if (!mobile) {
      setIsModalOpen(false); // Reset modal on desktop
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const _handleChangeTitle = (value) => {
    console.log(value);
    
  }

  const _handleSendResponses = async () => {
    if (textValueToResponse !== '' && storyTitle !== '') {
      let prompt = '';
      if (agentQuestion !== '¿Cómo inicia la historia?') {
        prompt = `
          Etapa ${stage}.
          <inicio>${agentResponse ? removeFixTags(agentResponse?.inicio): ''}<inicio>.
          <nudo>${agentResponse ? removeFixTags(agentResponse?.nudo): ''}<nudo>.
          <desenlace>${agentResponse ? removeFixTags(agentResponse?.desenlace): ''}<desenlace>
          <r>(${agentQuestion}),(${textValueToResponse})<r>"
        `;
        if (agentResponse === '' || agentResponse?.respuesta[stage]?.[0]?.includes('true:')) {
          console.log(agentResponse, agentResponse !== '' ? agentResponse?.respuesta[stage][0]?.includes('true:'): '', stage);
          prompt = `
            Etapa ${stage}.
            <inicio>${stage === 'inicio' ? (`${textValueToResponse}`) : (agentResponse ? removeFixTags(agentResponse?.inicio): '')}<inicio>.
            <nudo>${stage === 'nudo' ? (`${textValueToResponse}`) : (agentResponse ? removeFixTags(agentResponse?.nudo): '')}<nudo>.
            <desenlace>${stage === 'desenlace' ? (`${textValueToResponse}`) : (agentResponse ? removeFixTags(agentResponse?.desenlace): '')}<desenlace>
            <r><r>"
          `;
        }
      } else {
        const response = await saveStory(email, storyTitle);
        setStoryIdSaved(response.storyId);
        prompt = `
          Etapa inicio.
          <inicio><inicio>.
          <nudo><nudo>.
          <desenlace><desenlace>
          <r>(¿Cómo inicia la historia?),(${textValueToResponse})<r>"
        `;
      }
      setLoadingAnswer(true);
      const response = await getQuestionsFromAgent(prompt);
      setLoadingAnswer(false);
      let responseFormat = extractTaggedContent(response.output);

      try {
        console.log(responseFormat);
        
        console.log(responseFormat, responseFormat !== '' ? responseFormat?.respuesta[stage]?.[0]?.includes('true') : '', agentResponse !== '' ? agentResponse.respuesta[stage]: '');
        console.log(responseFormat);
        
        setAgentResponse(responseFormat);
        setAgentQuestion(responseFormat?.q[0]);
        if (responseFormat !== '' && responseFormat?.respuesta[stage][0].includes('true:')) {
          if (stage === 'inicio') {
            setLoadingImage(true);
            const responseImage01 = await generateFirstImage(
              responseFormat[stage],
              email,
              storyIdSaved,
              stage
            );
            console.log(responseImage01);
            setLoadingImage(false);
            setStage('nudo');
          } else if(stage === 'nudo') {
            setLoadingImage(true);
            const responseImage01 = await generateFollowedImage(
              email+storyIdSaved+"inicio",
              userActualStory,
              email,
              storyIdSaved,
              stage
            );
            console.log(responseImage01);
            setLoadingImage(false);
            setStage('desenlace');
          } else {
            setLoadingImage(true);
            const responseImage01 = await generateFollowedImage(
              email+storyIdSaved+"nudo",
              userActualStory,
              email,
              storyIdSaved,
              stage
            );
            console.log(responseImage01);
            setLoadingImage(false);
            setStage('done');
          }
          const responseStage = await saveStages(
            email,
            storyIdSaved,
            formatFixTags(responseFormat.inicio),
            formatFixTags(responseFormat.nudo),
            formatFixTags(responseFormat.desenlace)
          );
          console.log(responseStage);
        }

        let formatStyleForText = formatFixTags((responseFormat?.inicio !== null ? responseFormat?.inicio : '') + (responseFormat?.nudo !== null ? responseFormat?.nudo : '')  + (responseFormat?.desenlace !== null ? responseFormat?.desenlace : '') );
        console.log(formatStyleForText);
        
        setUserActualStory(formatStyleForText);
        console.log(responseFormat);
        setTextValueToResponse('');
      } catch (error) {
        console.log(error);
        console.log("vuelve a intentar enviarlo");
      }
    } else {
      console.log(storyTitle, textValueToResponse);
      
    }
    
  }

  const _handleSaveStory = async () => {
    setLoadingAnswer(true);
    const responseStage = await saveStages(
      email,
      storyIdSaved,
      formatFixTags(agentResponse.inicio),
      formatFixTags(agentResponse.nudo),
      formatFixTags(agentResponse.text[0])
    );
    setLoadingAnswer(false);
    if (responseStage && responseStage.message === "Cuento guardado") {
      setStoryTitle('');
      setTextValueToResponse('');
      setUserActualStory('');
      setStage('inicio');
      setStoryIdSaved('');

    }
    console.log(responseStage);
  }
  const _handleSetResponse = (value) => {
    setTextValueToResponse(value);
  }

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const stories = await getStoriesByEmail(email);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando historias:", error.message);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const [ imageInicioExists, setImageInicioExists ] = useState(false);
  const [ imageNudoExists, setImageNudoExists ] = useState(false);
  const [ imageDesenlaceExists, setImageDesenlaceExists ] = useState(false);
  useEffect(() => {
    if (!stage || storyIdSaved === '') return;
    const imgInicio = new Image();
    const imgNudo = new Image();
    const imgDesenlace = new Image();
    imgInicio.src = `https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'inicio'}`;
    imgNudo.src = `https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'nudo'}`;
    imgDesenlace.src = `https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'desenlace'}`;

    imgInicio.onload = () => setImageInicioExists(true);
    imgInicio.onerror = () => setImageInicioExists(false);
    //
    imgNudo.onload = () => setImageNudoExists(true);
    imgNudo.onerror = () => setImageNudoExists(false);
    //
    imgDesenlace.onload = () => setImageDesenlaceExists(true);
    imgDesenlace.onerror = () => setImageDesenlaceExists(false);
  }, [stage]);
  
  return (
    <div className="root">
      <Info email={email}></Info>
      {!loading ? 
        <div className="main_story_container">
          <div className='old_histories_button'>
            <Button className='old_histories_button_inner'></Button>
          </div>
          <div className='main_story_container_bottom'>
            {/* Left panel visible on desktop or when modal is closed */}
            <div className='main_story_left'>
              <div className='story_title_container'>Mi cuento en imagenes</div>
              <div className='main_story_left_images'>
                {
                  stage &&
                  <>
                    {
                      imageInicioExists ?
                        <div className='empty_image'>
                          <img style={{height: '100%', borderRadius: '4px'}} src={`https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'inicio'}`} alt="imagen" />
                        </div>
                        :
                        <div className='empty_image'></div>
                    }
                    {
                      imageNudoExists ?
                      <div className='empty_image'>
                        <img style={{height: '100%', borderRadius: '4px'}} src={`https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'nudo'}`} alt="imagen" />
                      </div>
                      :
                      <div className='empty_image'></div>
                    }
                    {
                      imageDesenlaceExists ?
                      <div className='empty_image'>
                        <img style={{height: '100%', borderRadius: '4px'}} src={`https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+storyIdSaved+'desenlace'}`} alt="imagen" />
                      </div>
                      :
                      <div className='empty_image'></div>
                    }
                  </>
                }
               
              </div>
              <div className='story_title_container'>Mi cuento en palabras</div>
              <div className="main_story_left_text" id='notebook-paper'>
                <div id='content'>
                  <div dangerouslySetInnerHTML={{ __html: userActualStory }} />
                </div>
              </div>
            </div>
            

            {/* Right panel becomes modal on mobile */}
            <div className={`main_story_right ${isModalOpen ? "open" : ""}`}>
              {isMobile && (
                <button
                  className="toggle-button"
                  onClick={isModalOpen ? handleCloseModal : handleOpenModal}
                >
                  {isModalOpen ? ">" : "<"}
                </button>
              )}
              <div className='agent_help_top_container'>
                <h2>Hola! Soy Cucú.</h2> 
                <div className='agent_help_top_container_avatar'>
                  <div className='agent_help_top_container_avatar_left'>
                    <img className='image_avatar' src={tommyAvatar} alt="" />
                  </div>
                  <div className='agent_help_top_container_avatar_right'>
                    <p style={{fontWeight: '200', marginTop: '0px', whiteSpace: 'pre-wrap'}}>
                    {`¡Estoy Aquí para ayudarte a escribir tus cuentos!\n\nRecuerda que todos los cuentos tienen  3 partes: inicio, nudo y desenlace.`}
                    </p>
                    <strong>¡Vamos a crear historias increibles!</strong>
                  </div>
                </div>
                
                
                <div className='agent_help_top_container_stage'>
                  <h3>Etapa:</h3>
                  <p>{stage !== 'done' ? stage : 'Tu historia cumple con la estructura necesaria.'}</p>
                </div>
                {agentQuestion && stage !== 'done' &&
                  <div className='agent_help_bottom_container_stage'>
                    <h3>Pistas:</h3>
                    <p>{agentQuestion}</p>
                  </div>
                }
                 <TextField
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
                  label="Titulo"
                  placeholder='Elige un titulo, este lo puedes cambiar luego.'
                  value={storyTitle}
                  onChange={(event) => setStoryTitle(event.target.value)}
                 ></TextField>
                 {

                 }
                 {stage !== 'done' ?
                    <>
                      {/**
                       * <p style={{marginLeft: '13px', marginBottom: '5px'}}>Ingresa tu respuesta:</p>
                       */}
                      <TextField
                        disabled={loadingAnswer}
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
                        id="outlined-multiline-static"
                        label=""
                        multiline
                        placeholder='Trata de seguir tu historia con base en la pregunta de Cucú.'
                        rows={4}
                        value={textValueToResponse}
                        onChange={(e) => _handleSetResponse(e.target.value)}
                      />
                      <br />
                      <br />
                      <Button
                          variant="contained"
                          loading={loadingAnswer}
                          disabled={textValueToResponse === '' || storyTitle === ''}
                          style={{
                            marginLeft: '10px'
                          }}
                          onClick={_handleSendResponses}>
                            Enviar
                      </Button>
                    </> :
                    <>
                    <Button
                          variant="contained"
                          loading={loadingAnswer}
                          style={{
                            marginLeft: '10px',
                            marginTop: '20px'
                          }}
                          onClick={_handleSaveStory}>
                            Guardar
                      </Button>
                    </>
              }
              </div>
            </div>
          </div>
      </div>
      :
      <div className='loading_view'>
        <CircularProgress size={100} />
      </div>
    
      }
      {loadingImage &&
        <ModalText stage={stage}/>
      }
      
    </div>
  )
}

export default Home;
