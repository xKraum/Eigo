const { getMongoClient } = require('../dbConnection.js');

const WORDS_COLLECTION_NAME = 'words';
const DICTIONARY_COLLECTION_NAME = 'dictionary';

async function getAllWords() {
  const client = await getMongoClient();
  const collection = client.db().collection(WORDS_COLLECTION_NAME);

  const result = await collection
    .aggregate([
      { $unwind: '$words' },
      {
        $group: {
          _id: null,
          words: { $push: '$words' },
        },
      },
    ])
    .toArray();

  client.close();
  return result[0]?.words || [];
}

async function getWordsDataByNames(wordArray) {
  const client = await getMongoClient();
  const collection = client.db().collection(DICTIONARY_COLLECTION_NAME);

  const result = await collection
    .aggregate([
      { $unwind: '$dictionary' },
      {
        $match: {
          'dictionary.word': {
            $in: wordArray.map((word) => new RegExp(`^${word}$`, 'i')),
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          dictionary: { $push: '$dictionary' },
        },
      },
    ])
    .toArray();

  client.close();
  return result[0]?.dictionary || [];
}

module.exports = { getAllWords, getWordsDataByNames };
