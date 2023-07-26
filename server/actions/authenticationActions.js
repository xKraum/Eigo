const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
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
      client.close();
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

async function getUserByAuthFields(_id, username, email) {
  if (_id && username && email) {
    const client = await getMongoClient(MONGO_DB_DATABASE_NAME);

    try {
      const collection = client.db().collection(USERS_COLLECTION_NAME);
      const user = await collection.findOne({
        _id: new ObjectId(_id),
        username,
        email,
      });
      client.close();
      return user;
    } catch (error) {
      client.close();
    }
  }

  return null;
}

// TODO: Implement token authentication system
async function handleUserLoginOrSessionReload(
  req,
  res,
  isSessionReload = false,
) {
  try {
    const {
      reqId: _id,
      reqUsername: username,
      reqEmail: email,
      reqPassword,
    } = req.query;

    // Check values based on if is login or session reload
    if (
      (!isSessionReload && (!username || !reqPassword)) ||
      (isSessionReload && (!_id || !username || !email))
    ) {
      res.status(400).json({
        error: 'One or more required attributes are missing or empty.',
      });
      return;
    }

    const user = isSessionReload
      ? await getUserByAuthFields(_id, username, email)
      : await getUserByUsername(username);

    if (!user) {
      const errorMessage = !isSessionReload
        ? 'The provided username or password is incorrect.'
        : 'Unauthorized.';

      res.status(401).json({
        error: errorMessage,
      });
      return;
    }

    if (!isSessionReload) {
      const isMatch = await doesPasswordMatch(reqPassword, user.password);
      if (!isMatch) {
        res.status(401).json({
          error: 'The provided username or password is incorrect.',
        });
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;
    res
      .status(200)
      .json({ message: 'Login successful.', user: { ...userData } });
  } catch (error) {
    res.status(500).json({
      error: `Error while ${
        isSessionReload ? 'reloading the user session' : 'logging in the user'
      }.`,
    });
  }
}

module.exports = {
  doesUserExistByUsernameOrEmail,
  userRegister,
  handleUserLoginOrSessionReload,
};
