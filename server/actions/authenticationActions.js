const bcrypt = require('bcrypt');
const { getMongoClient } = require('../dbConnection.js');

const USERS_COLLECTION_NAME = 'users';
const MONGO_DB_DATABASE_NAME = 'EigoAuth';

async function doesUserExistByUsernameOrEmail(username, email) {
  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
  let userExist = true;

  try {
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const userExists = await collection.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
      ],
    });

    if (userExists) {
      console.log(
        `User already exists: ${userExists.username} ${userExists.email}`,
      );
    } else {
      userExist = false;
    }
  } catch (error) {
    throw new Error('Error while registering the user.');
  }

  return userExist;
}

async function userRegister(username, email, password) {
  const client = await getMongoClient(MONGO_DB_DATABASE_NAME);
  let createdUser = null;

  try {
    const collection = client.db().collection(USERS_COLLECTION_NAME);

    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing

    const user = { username, email, password: hashedPassword };
    await collection.insertOne(user);

    createdUser = user;
    if (createdUser) {
      console.log('User created successfully: ', createdUser);
    }
  } catch (error) {
    throw new Error('Error while registering the user.');
  }

  return createdUser;
}

module.exports = { doesUserExistByUsernameOrEmail, userRegister };
