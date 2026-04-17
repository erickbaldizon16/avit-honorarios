// netlify/functions/blobs.js
// Netlify Function para guardar y recuperar datos de AVIT usando Netlify Blobs.
// Documentación: https://docs.netlify.com/blobs/overview/

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // El store 'avit-datos' es donde guardamos todos los datos.
    // Cada usuario tiene su propia key (definida por él mismo).
    const store = getStore('avit-datos');

    // ── SUBIR DATOS (POST) ──────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const { key, datos } = JSON.parse(event.body);

      if (!key || !datos) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Faltan key o datos' }),
        };
      }

      // Guardamos el objeto datos serializado como string JSON
      await store.setJSON(key, datos);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    // ── BAJAR DATOS (GET) ───────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const key = event.queryStringParameters?.key;

      if (!key) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Falta el parámetro key' }),
        };
      }

      const datos = await store.getJSON(key);

      if (datos === null) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'No hay datos para esa key' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ datos }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };

  } catch (err) {
    console.error('Error en blobs.js:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
