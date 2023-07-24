const bcrypt = require('bcrypt');
const { getMongoClient } = require('../dbConnection.js');

const USERS_COLLECTION_NAME = 'users';
const MONGO_DB_DATABASE_NAME = 'EigoUsers';

async function doesUserExistByUsernameOrEmail(username, email) {
  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
  let userExist = true;

  const query = {
    $or: [],
  };

  if (username) {
    query.$or.push({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  }

  if (email) {
    query.$or.push({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
  }

  if (query.$or.length) {
    try {
      const collection = client.db().collection(USERS_COLLECTION_NAME);
      const userExists = await collection.findOne(query);

      if (userExists) {
        console.log(
          `User already exists: ${userExists.username} ${userExists.email}`,
        );
      } else {
        userExist = false;
      }
    } catch (error) {
      client.close();
      throw new Error('Error while checking if the user exists.');
    }
  }

  client.close();
  return userExist;
}

async function userRegister(username, email, password) {
  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
  let createdUser = null;

  try {
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing

    const user = {
      username,
      email,
      password: hashedPassword,
      preferences: {},
      categories: [],
      words: [],
    };
    await collection.insertOne(user);

    createdUser = user;
    if (createdUser) {
      console.log('User created successfully: ', createdUser);
    }
  } catch (error) {
    client.close();
    throw new Error('Error while registering the user.');
  }

  client.close();
  return createdUser;
}

async function getUserByUsername(username) {
  if (username) {
    const client = await getMongoClient(MONGO_DB_DATABASE_NAME);

    const query = {
      $or: [{ username: { $regex: new RegExp(`^${username}$`, 'i') } }],
    };

    try {
      const collection = client.db().collection(USERS_COLLECTION_NAME);
      const user = await collection.findOne(query);
      return user;
    } catch (error) {
      console.log('[getUserByUsername] username: ', username, error);
      client.close();
    }
  }

  return null;
}

async function doesPasswordMatch(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

module.exports = {
  doesUserExistByUsernameOrEmail,
  getUserByUsername,
  doesPasswordMatch,
  userRegister,
};
