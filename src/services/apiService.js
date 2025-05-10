const API_URL = "http://localhost:5050"; // Cambia esto si tu backend está en otra URL
const API_URL_PROD = "http://54.167.30.72:5050"; 
// Función genérica para hacer peticiones POST
const postRequest = async (endpoint, payload) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Registro o ingreso por email
export const enterByEmail = async (userId) => {
  return postRequest("/api/users", { userId });
};
//guardar stories
export const saveStory = async (userId, title) => {
  return postRequest("/api/stories", { userId, title });
};
//guardar stages
export const saveStages = async (userId, storyId, inicio, nudo, desenlace) => {
  return postRequest("/api/stages", { userId, storyId, inicio, nudo, desenlace });
};
// Obtener todas las historias por email
export const getStoriesByEmail = async (userId) => {
  return postRequest("/api/getstories", { userId });
};

export const generateFirstImage = async (prompt, userId, storyId, stage) => {
  return postRequest("/api/images/generate-image", { prompt, userId, storyId, stage });
};
export const generateFollowedImage = async (imagePath, prompt, userId, storyId, stage) => {
  return postRequest("/api/images/edit-image", { imagePath, prompt, userId, storyId, stage });
};
export const getQuestionsFromAgent = async (prompt) => {
    return postRequest("/api/images/generate-text", { prompt });
    return {
      "message": "text generated successfully",
      "output": "<inicio>Había una vez una niña llamada Emilie, que vivía en el Bosque Encantado cerca de su pueblo natal. El lugar estaba lleno de árboles altos y animales curiosos que siempre estaban atentos a todo lo que pasaba. Emilie era conocida por su curiosidad y su valor para explorar los rincones más misteriosos del bosque. Una de las cosas que más disfrutaba era cuidar animalitos huérfanos y darles de comer, pues sentía que así podía ayudar a quienes más lo necesitaban. Un día, Emilie encontró un búho abandonado, lo cual le pareció muy llamativo porque, igual que ella, jugaba ajedrez. El búho era enorme y tenía ojos brillantes.<inicio>.\n<nudo>Emilie sintió curiosidad y quiso invitarlo a jugar ajedrez. El búho aceptó su invitación y se citaron al día siguiente en la cascada donde había muchas rocas donde podían sentarse a jugar. Cuando llegaron a la cascada al día siguiente se encontraron con muchos animales emocionados por su partida. Empezaron a jugar y, para sorpresa de Emilie, todos los animales la estaban apoyando a ella; estaban ilusionados porque era increíble que una niña pequeña tuviera tanto talento. Mientras jugaban Emilie descubrió que el búho le estaba haciendo trampa, y decidió terminar la partida.<nudo>.\n<desenlace><text>Emilie se pone triste porque creyó en él y él la traicionó. Sin embargo, decide darle otra oportunidad al <fix>búho,buho<fix> para que puedan jugar limpio juntos. La partida continúa y, esta vez, juegan de manera honesta. Al final, Emilie logra vencerlo, dándole una lección de honor y humildad. Todos los animales celebran, comen torta y se sienten felices por lo que han aprendido sobre el valor de la honestidad y la confianza.<text><desenlace>\n<q1>¿Qué hacen Emilie y el búho después de la fiesta: se hacen mejores amigos y organizan más juegos para los animales, o cada uno sigue su camino, recordando lo aprendido?<q1>\n<done>true<done>\n<respuesta><inicio>true: El inicio cumple presentando personaje, lugar y contexto.<inicio><nudo>true: El nudo muestra claramente el conflicto y tiene la longitud adecuada.<nudo><desenlace>true: El desenlace resuelve el conflicto y refleja un aprendizaje, superando los 200 caracteres.<desenlace></respuesta>"
    }
    return {
        "message": "text generated successfully",
        "output": "<inicio>Había una vez una niña llamada Emilie que vivía en un bosque encantado cerca de su pueblo natal, Pitalito. Ese bosque era enorme, tenía muchos animales encantados que hablaban y jugaban al ajedrez. A Emilie le gustaba llevar su tablero de ajedrez para jugar con el sabio gorila, quien en su vida pasada había sido gran maestro de ajedrez. La relación con el sabio gorila era hermosa, de amigos, de rivales que se respetaban.<inicio>.\n<nudo><text>Una vez el <fix>gorila,Gorila<fix> jugó una partida que dejó a Emilie impresionada, la manera en la que jugó no le dio posibilidad de ganar ni una oportunidad. Emilie supo que podía aprender mucho del <fix>gorila,Gorila<fix>, ya que <fix>habia,había<fix> notado que sabía mucho, y así esto le <fix>podia,podía<fix> permitir cumplir su sueño de ser gran maestro de ajedrez.<text><nudo>\n<desenlace><desenlace>\n<q1>¿Emilie le pidió al Gorila que le enseñara sus jugadas favoritas, o se ofreció a ayudarlo a organizar un torneo en el bosque?\n<done>false<done>\n<respuesta><inicio>true: El inicio cumple, presenta bien al personaje, el lugar y la relación, y supera los 200 caracteres.<inicio><nudo>false: El nudo todavía es muy breve y debe profundizarse en el conflicto o reto que enfrenta Emilie.<nudo><desenlace>false: No hay desenlace todavía, debe desarrollarse y superar 200 caracteres.<desenlace></respuesta>"
    }
    return {
      "message": "text generated successfully",
      "output": "<inicio>Juliana vivía en un bosque encantado. Un día muy soleado del mes de mayo, Juliana decidió ir a la cascada con su amiga la rana, que era enorme, tenía manchas amarillas y sus ojos eran muy grandes. Ellas estaban buscando a su amigo el ratón, el cual llevaba perdido durante 8 días, y estaban muy preocupadas por él.<inicio>.\n<nudo>Cuando llegaron a la cascada, su amigo el ratón estaba oculto arriba de la copa de un árbol, perseguido por un lobo malvado. Cuando ellas llegaron, el lobo se espantó y el ratón pudo volver a bajar.<nudo>.\n<desenlace><text>Ellos estaban felices de volver a estar juntos, se regresaron a su casa felices, corriendo y bailando. Cuando llegaron a la casa, celebraron con torta y bebidas, invitaron a todos los animales del bosque y contaron a todos lo que había pasado. Ellos se pusieron felices porque el ratón había logrado sobrevivir, y estaban juntos de nuevo. Al final de la fiesta el <fix>buho,búho<fix> sabio dijo que la amistad era lo más importante de la vida, y que el <fix>raton,ratón<fix> era afortunado de tener amigos con tanto valor.<text><desenlace>\n<done>true<done>\n<q1>¿Cómo se sintió el ratón al escuchar las palabras del búho sabio? ¿Agradeció a sus amigos o les prometió algo especial?<q1>\n<respuesta><inicio>true: inicio presentado con ambiente, personajes y situación<inicio><nudo>true: nudo presenta el conflicto y explica el reto< nudo><desenlace>true: desenlace resuelve el conflicto, incluye aprendizaje y supera los 200 caracteres<desenlace></respuesta>"
    }
  };
 