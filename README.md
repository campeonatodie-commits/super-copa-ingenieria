# Starter: GitHub Pages + Decap CMS (opcional Netlify)

Este starter te permite publicar una web de estadísticas de fútbol **gratis**. Incluye:
- Páginas estáticas responsive (Inicio, Tabla, Fotos).
- Datos en **/data** (JSON) y un script que calcula la **tabla** y **goleadores**.
- **Decap CMS** (en `/admin`) para editar contenido. **Login más fácil en Netlify** (free) con Identity + Git Gateway.
- PWA básica (instalable como app).

## 🚀 Cómo empezar (solo GitHub Pages)

1. Crea un repositorio en GitHub (p.ej. `liga-amateur`).
2. Sube todo el contenido de este zip al repo, en la **raíz**.
3. En **Settings → Pages**: Source = `Deploy from a branch`, Branch = `main` (root).
4. Accede a `https://TU_USUARIO.github.io/` (o `https://TU_USUARIO.github.io/liga-amateur/` si es repo no-usuario).
5. Edita los JSON en `/data` desde el editor web de GitHub para actualizar estadísticas.

> **CMS en GitHub Pages:** Para login con Decap CMS en GitHub Pages se requiere un **OAuth server**. Es posible pero técnico. Ver: https://decapcms.org/docs/backends-overview/#github-backend

## ✅ Alternativa recomendada (Netlify + GitHub)

1. Conecta tu repo a **Netlify** (gratis) y deploy.
2. En Netlify: activa **Identity** + **Git Gateway** (roles abiertos o por invitación).
3. En `admin/config.yml` ya está `backend: git-gateway`. Abre `/admin` y loguéate.
4. Edita/crea equipos, partidos, jugadores y fotos desde el CMS.

## 🧩 Estructura de datos

- `data/teams.json`, `players.json`, `matches.json`, `events.json`, `photos.json`
- El CMS crea entradas individuales en `data/equipos`, `data/jugadores`, `data/partidos`, `data/eventos`.
- Puedes automatizar un build (Jekyll/Eleventy) para consolidar, o mantener manualmente los JSON principales.

## 🗺️ SEO
- `robots.txt` y `manifest.json` incluidos.
- Agrega un `sitemap.xml` (puedes generarlo manualmente o con un generador estático si decides usar Jekyll).

## 📱 PWA
- Ya registra `sw.js` y `manifest.json` para instalación.
- Cambia los íconos en `/uploads` por imágenes reales (192 y 512 px).

## 🛠️ Personalización
- Edita estilos en `/assets/styles.css`.
- Marca, colores, logos en `/uploads` y `index.html`.

---

© 2025 Starter libre para uso educativo.
