const fetch = require('node-fetch');

async function fetchWithScrapingBee(targetUrl) {
  const apiKey = '8402UI7UYEOFNQFYJV7VWGDQTJ7U08Q8P5Q0EYHN7UK4JLYJPVZKXXM6FE00Z4WQF2ZDS83H5QGQX8S6';

  const apiUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error('Erro HTTP:', response.status, response.statusText);
      return null;
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error.message);
    return null;
  }
}

(async () => {
  const html = await fetchWithScrapingBee('https://www.arsenalsecretodosceos.com.br/promocao');

  if (html) {
    console.log(html);
  } else {
    console.log('Não foi possível extrair HTML.');
  }
})();
