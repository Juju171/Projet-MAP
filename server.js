const express = require('express');
const app = express();
const port = 5000;

const news = [
  { title: 'Tournoi d\'été terminé avec succès' },
  { title: 'Nouveau court de tennis inauguré' }
];

const events = [
  { name: 'Tournoi de Printemps', date: '2024-04-15' },
  { name: 'Match Amical', date: '2024-05-10' }
];

app.get('/api/news', (req, res) => {
  res.json(news);
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
