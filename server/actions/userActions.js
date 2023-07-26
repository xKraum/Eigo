const { ObjectId } = require('mongodb');
const { getMongoClient } = require('../dbConnection.js');

const USERS_COLLECTION_NAME = 'users';
const MONGO_DB_DATABASE_NAME = 'EigoUsers';

async function isWordAlreadyAdded(userWords, word, index) {
  return userWords.some((userWordObject) => {
    const { word: userWord, descriptionIndex } = userWordObject;
    return userWord === word && descriptionIndex === index;
  });
}

async function getUserWords(_id) {
  try {
    const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const filter = { _id: new ObjectId(_id) };
    const projection = { _id: 0, words: 1 };

    const response = await collection.findOne(filter, { projection });

    if (response?.words?.length) {
      return response?.words;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
}

async function addWordToUserList(req, res, doServerCheck = true) {
  const { userId: _id } = req.query;
  const { word } = req.body;

  if (!_id || !word) {
    res.status(400).json({
      error: 'One or more required attributes are missing or empty.',
    });
    return;
  }

  if (doServerCheck) {
    const userWords = await getUserWords(_id);
    if (userWords?.length) {
      const isWordAdded = await isWordAlreadyAdded(
        userWords,
        word.word,
        word.descriptionIndex,
      );
      if (userWords?.length && isWordAdded) {
        res.status(409).json({
          error: 'The word is already in the user list.',
        });
        return;
      }
    }
  }

  try {
    const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const filter = { _id: new ObjectId(_id) };
    const update = { $push: { words: word } };
    const response = await collection.updateOne(filter, update);

    if (response?.modifiedCount === 1) {
      res.status(200).json({ message: 'Word added successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to add word.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add word.' });
  }
}

module.exports = {
  addWordToUserList,
};
