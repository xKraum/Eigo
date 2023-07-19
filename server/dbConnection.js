const { MongoClient } = require('mongodb');

// MongoDB connection URI
const MONGO_DB_USERNAME = 'eigosrs';
const MONGO_DB_PASSWORD = 'AC9pA6Neg4UAI4S1';
const MONGO_DB_DATABASE_NAME = 'EigoSRS';
const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@eigo.e8xtuhi.mongodb.net/${MONGO_DB_DATABASE_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB
async function getMongoClient() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { getMongoClient };
