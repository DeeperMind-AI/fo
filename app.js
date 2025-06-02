// 📁 Structure du projet :
// project-root/
// ├── app.js
// ├── locales/
// │   ├── en/translation.json
// │   ├── fr/translation.json
// ├── views/
// │   ├── index.pug
// │   └── layout.pug
// └── public/

const express = require('express');
const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const dotenv = require('dotenv');

//CHARGEMENT CONFIG
dotenv.config();

// Initialisation i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json')
    },
    detection: {
      order: ['path', 'querystring', 'cookie', 'header'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lng'
    }
  });

const app = express();

// Middleware i18next
app.use(middleware.handle(i18next));

// Configuration Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Redirections propres pour /fr et /en
app.get('/:lng/', (req, res) => {
  const { lng } = req.params;
  if (!['fr', 'es','en'].includes(lng)) return res.redirect('/en/');
  res.render('index', { lang:lng,page:'',t: req.t });
});

// Redirections propres pour /fr et /en
app.get('/:lng/blog.html', (req, res) => {
  const { lng } = req.params;
  if (!['fr', 'es','en'].includes(lng)) return res.redirect('/en/blog.html');
  res.render('blog', { lang:lng ,page:'blog.html',t: req.t });
});

// Redirections propres pour /fr et /en
app.get('/:lng/blog/meet_your_smart_assistant.html', (req, res) => {
  const { lng } = req.params;
  if (!['fr', 'es','en'].includes(lng)) return res.redirect('/en/blog/meet_your_smart_assistant.html');
  res.render('blogitem', { lang:lng ,page:'blog/meet_your_smart_assistant.html',t: req.t });
});

// Redirection racine → langue par défaut
app.get('/', (req, res) => {
  const lang = req.language || 'en';
  res.redirect(`/${lang}/`);
});

console.log(process.env.PORT);

// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeeperMind multilingue dispo sur http://localhost:${PORT}`);
});