const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  doesUserExistByUsernameOrEmail,
  userRegister,
  handleUserLoginOrSessionReload,
} = require('./actions/authenticationActions.js');
const {
  getAllWords,
  getWordsDataByNames,
} = require('./actions/dictionaryActions.js');
const { addWordToUserList } = require('./actions/userActions.js');

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

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

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

app.post('/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Existing values check.
    if (!username || !email || !password) {
      res.status(400).json({
        error: 'One or more required attributes are missing or empty.',
      });
      return;
    }

    // User exists check.
    const userExists = await doesUserExistByUsernameOrEmail(username, email);
    if (userExists) {
      res.status(403).json({
        error: 'User with the provided username or email already exists.',
      });
      return;
    }

    // Register the user.
    await userRegister(username, email, password);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error while registering the user.' });
  }
});

app.get('/users/login', async (req, res) => {
  await handleUserLoginOrSessionReload(req, res, false);
});

app.get('/users/reloadSession', async (req, res) => {
  await handleUserLoginOrSessionReload(req, res, true);
});

app.post('/users/addWord', async (req, res) => {
  const doServerCheck = true;
  await addWordToUserList(req, res, doServerCheck);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.listen(port, () => {
  console.log(`App listening to the port ${port}`);
});
