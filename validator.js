function validateAndRespond() {
  // Pegar parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const format = urlParams.get('_format');
  const secretCode = urlParams.get('_secretCode');
  
  // Verificar formato
  if (format !== 'application/validador-iti+json') {
    return respondWithError(400, 'Bad Request');
  }
  
  // Carregar dados de prescrições
  fetch('./data/prescriptions.json')
    .then(response => response.json())
    .then(data => {
      // Verificar código secreto
      if (!secretCode || !data[secretCode]) {
        return respondWithError(401, 'Not Authorized');
      }
      
      // Responder com o JSON correto
      const responseData = {
        "version": "1.0.0",
        "prescription": {
          "signatureFiles": [
            {
              "url": data[secretCode].url
            }
          ]
        }
      };
      
      document.getElementById('response').textContent = JSON.stringify(responseData, null, 2);
      document.getElementById('status').textContent = '200 OK';
    })
    .catch(() => {
      respondWithError(404, 'Not Found');
    });
}

function respondWithError(code, message) {
  document.getElementById('status').textContent = `${code} ${message}`;
  document.getElementById('response').textContent = '';
}
