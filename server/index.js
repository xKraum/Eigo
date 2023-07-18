const express = require('express');
const cors = require('cors');
const {
  getAllWords,
  getWordsDataByNames,
} = require('./actions/dictionaryActions.js');

const app = express();
const port = 5000;

app.use(cors());

app.use((req, res, next) => {
  const now = new Date();
  const options = {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const formattedDate = now.toLocaleString('es-ES', options);

  console.log(
    `[${formattedDate}] Request made to: ${req.method} ${req.originalUrl}`,
  );
  next();
});

app.get('/dictionary/words', async (req, res) => {
  try {
    const words = await getAllWords();
    res.json(words);
  } catch (error) {
    res.status(500).json({
      error: 'Something went wrong while fetching all dictionary words.',
    });
  }
});

app.get('/dictionary', async (req, res) => {
  const { words } = req.query;

  if (!words) {
    res.status(400).json({ error: 'Invalid query parameters.' });
    return;
  }

  const wordArray = words ? words.split(',') : [];

  try {
    const wordsData = await getWordsDataByNames(wordArray);
    res.json(wordsData);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Something went wrong while fetching words data.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.listen(port, () => {
  console.log(`App listening to the port ${port}`);
});
