// netlify/functions/blobs.js
// Usa el formato de Netlify Functions v2 con ES Modules
// para que Netlify Blobs funcione sin configuración extra.

import { getStore } from “@netlify/blobs”;

export default async (request, context) => {
const headers = {
“Access-Control-Allow-Origin”: “*”,
“Content-Type”: “application/json”,
};

if (request.method === “OPTIONS”) {
return new Response(””, { status: 200, headers });
}

try {
const store = getStore(“avit-datos”);

```
// SUBIR datos (POST)
if (request.method === "POST") {
  const { key, datos } = await request.json();
  if (!key || !datos) {
    return new Response(
      JSON.stringify({ error: "Faltan key o datos" }),
      { status: 400, headers }
    );
  }
  await store.setJSON(key, datos);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}

// BAJAR datos (GET)
if (request.method === "GET") {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) {
    return new Response(
      JSON.stringify({ error: "Falta el parámetro key" }),
      { status: 400, headers }
    );
  }
  const datos = await store.getJSON(key);
  if (datos === null) {
    return new Response(
      JSON.stringify({ error: "No hay datos para esa key" }),
      { status: 404, headers }
    );
  }
  return new Response(JSON.stringify({ datos }), { status: 200, headers });
}

return new Response(
  JSON.stringify({ error: "Método no permitido" }),
  { status: 405, headers }
);
```

} catch (err) {
console.error(“Error en blobs.js:”, err);
return new Response(
JSON.stringify({ error: err.message }),
{ status: 500, headers }
);
}
};

export const config = {
path: “/.netlify/functions/blobs”
};
