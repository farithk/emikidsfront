import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from "react-router-dom";
import Info from './Info.jsx';

import {
  getStoriesByEmail
} from "../services/apiService";

import './MyStories.css'

function MyStories() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [ userActualStory, setUserActualStory ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ stories, setStories ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ storyIdSaved, setStoryIdSaved ] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [ selectedStory, setSelectedStory ] = useState('');

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

  const [ imageInicioExists, setImageInicioExists ] = useState(false);
  const [ imageNudoExists, setImageNudoExists ] = useState(false);
  const [ imageDesenlaceExists, setImageDesenlaceExists ] = useState(false);

  useEffect(() => {
    if (!selectedStory || storyIdSaved === '') return;
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
  }, [selectedStory]);

  const _handleStorySelected = (story) => {
    let inicio = story.stages.inicio;
    let nudo = story.stages.nudo;
    let desenlace = story.stages.desenlace;
    console.log(story);
    setSelectedStory(story);
    
    setUserActualStory(inicio+nudo+desenlace);
    setStoryIdSaved(story.id);
  }

  return (
    <div className="root">
    <Info></Info>
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
                  <h2>Mi Biblioteca de Cuentos</h2> 
                  <br />
                  <div>
                    {stories.length > 0 &&
                      stories.map((story, index) => {
                        return(
                          <div
                            key={index}
                            className='story_item_container'
                            onClick={() => _handleStorySelected(story)}
                          >
                            <div className='story_item_inner'>
                              <div className='empty_image_mystories'>
                                <img
                                  style={{height: '100%', borderRadius: '4px'}}
                                  src={`https://storage.googleapis.com/emikids-cd4b2.firebasestorage.app/images/${email+story.id+'inicio'}`}
                                  alt="imagen"
                                  onError={(e) => {
                                    e.target.parentNode.innerHTML = `<div className='empty_image'></div>`;
                                  }}
                                />
                              </div>
                              <div>
                                {story.title}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
              </div>
            </div>
        </div>
    </div>
    :
    <div className='loading_view'>
      <CircularProgress size={100} />
    </div>
    }    
  </div>
  )
};

export default MyStories;
