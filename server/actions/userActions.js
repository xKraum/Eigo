const { ObjectId } = require('mongodb');
const { getMongoClient } = require('../dbConnection.js');

const USERS_COLLECTION_NAME = 'users';
const MONGO_DB_DATABASE_NAME = 'EigoUsers';

function isWordAlreadyAdded(userWords, { word, entries: entriesFromClient }) {
  const getWordAlreadyAdded = () => {
    const filteredWords = [...userWords].filter(
      (userWordObject) => userWordObject.word === word,
    );

    return filteredWords?.length ? filteredWords[0] : undefined;
  };

  const wordObjectDB = getWordAlreadyAdded(word);

  if (!wordObjectDB) {
    return false;
  }

  let isWordAdded = true;
  entriesFromClient.forEach((entry) => {
    if (isWordAdded) {
      // An entry of the client exists in any entry of the database?
      const entryExists = wordObjectDB.entries.some((entryDB) => {
        return entryDB.descriptionIndex === entry.descriptionIndex;
      });

      // If entry does not exist in the DB it means the entry is not added yet.
      if (!entryExists) {
        isWordAdded = false;
      }
    }
  });

  return isWordAdded;
}

async function getUserWords(_id) {
  try {
    const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const filter = { _id: new ObjectId(_id) };
    const projection = { _id: 0, words: 1 };

    const response = await collection.findOne(filter, { projection });

    if (response?.words?.length) {
      return response.words;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
}

async function getWordIndexInUserList(userId, word) {
  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);

  let index = -1;
  try {
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const filter = { _id: new ObjectId(userId) };

    const response = await collection
      .aggregate([
        { $match: filter },
        {
          $project: {
            index: {
              $indexOfArray: ['$words.word', word],
            },
          },
        },
      ])
      .toArray();

    const isIndex = response?.[0] && response?.[0]?.index !== -1;
    index = isIndex ? response[0].index : -1;
  } catch (error) {
    console.log(error);
  } finally {
    if (client) {
      client.close();
    }
  }

  if (index === -1) {
    console.error(`Word ${word} not found in the 'words' array.`);
  }

  return index;
}

async function addWordToUserList(req, res, doServerCheck = true) {
  const { userId: _id } = req.query;
  const { wordObject } = req.body;

  if (!_id || !wordObject) {
    res.status(400).json({
      error: 'One or more required attributes are missing or empty.',
    });
    return;
  }

  if (doServerCheck) {
    const userWords = await getUserWords(_id);
    if (userWords?.length && isWordAlreadyAdded(userWords, wordObject)) {
      res.status(409).json({
        error: 'The word is already in the user list.',
      });
      return;
    }
  }

  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
  try {
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const filter = { _id: new ObjectId(_id) };
    let update;
    let response;

    if (wordObject?.entries?.length === 1) {
      update = { $push: { words: wordObject } };
      response = await collection.updateOne(filter, update);
    } else if (wordObject?.entries?.length > 1) {
      const index = await getWordIndexInUserList(_id, wordObject.word);
      if (index !== -1) {
        update = {
          $set: {
            [`words.${index}.entries`]: wordObject.entries,
          },
        };
        response = await collection.updateOne(filter, update);
      }
    }

    if (response?.modifiedCount === 1) {
      res.status(200).json({ message: 'Word added successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to add word.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add word.' });
  } finally {
    if (client) {
      client.close();
    }
  }
}

module.exports = {
  addWordToUserList,
};
