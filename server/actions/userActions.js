const { ObjectId } = require('mongodb');
const { getMongoClient } = require('../dbConnection.js');

const USERS_COLLECTION_NAME = 'users';
const MONGO_DB_DATABASE_NAME = 'EigoUsers';

async function addWordToUserList(req, res) {
  const { userId: _id } = req.query;
  const { word } = req.body;

  if (!_id || !word) {
    res.status(400).json({
      error: 'One or more required attributes are missing or empty.',
    });
    return;
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
