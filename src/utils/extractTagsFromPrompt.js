export function extractTaggedContent(input) {
  const result = {
    inicio: null,
    nudo: null,
    desenlace: null,
    text: [],
    fix: [],
    q1: [],
    done: [],
    respuesta: {}
  };

  // Extraer contenido de <respuesta> y guardarlo por separado
  const respuestaMatch = input.match(/<respuesta>(.*?)<\/respuesta>/s);
  const respuestaContent = respuestaMatch ? respuestaMatch[1] : '';

  // Extraer contenido de tags <inicio>, <nudo>, <desenlace> fuera de <respuesta>
  for (const tag of ['inicio', 'nudo', 'desenlace']) {
    const regex = new RegExp(`<${tag}>(.*?)<${tag}>`, 'gs');
    const matches = [...input.matchAll(regex)];
    if (matches.length > 0) {
      const fullMatch = matches.find(m => !respuestaContent.includes(m[0]));
      if (fullMatch) result[tag] = fullMatch[1].trim();
    }
  }

  // Extraer los demás tags globalmente
  for (const tag of ['text', 'fix', 'q1', 'done']) {
    const regex = new RegExp(`<${tag}>(.*?)<${tag}>`, 'gs');
    const matches = [...input.matchAll(regex)].map(m => m[1].trim());
    if (matches.length) result[tag] = matches;
  }

  // Extraer contenido dentro de <respuesta>
  for (const tag of ['inicio', 'nudo', 'desenlace']) {
    const regex = new RegExp(`<${tag}>(.*?)<${tag}>`, 'gs');
    const matches = [...respuestaContent.matchAll(regex)].map(m => m[1].trim());
    if (matches.length) result.respuesta[tag] = matches;
  }

  return result;
}


export function formatFixTags(input) {
  const regex = /<fix>([^,]+),([^<]+)<fix>/g;

  // Replace all <fix>wrong,correct<fix> with HTML-styled span elements
  const formatted = input.replace(regex, (_, wrong, correct) => {
    return `<span style="color:red">(${wrong}</span> -> <span style="color:blue">${correct})</span>`;
  });

  return formatted;
}

export function removeFixTags(text) {
  return text
    .replace(/<fix>.*?,(.*?)<fix>/g, '$1')
    .replace(/<\/?text>/g, '');  
}
  