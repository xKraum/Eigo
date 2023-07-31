import axios, { AxiosError, AxiosResponse } from 'axios';
import { IFormattedDictionaryWord } from '../interfaces/formattedDictionary/IFormattedDictionary';
import { IWord } from '../interfaces/user/IUser';

// FIXME: To change, temporary private IP.
const BASE_URL = 'http://192.168.1.40:5000';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Fetches dictionary words from the server.
 *
 * @returns A promise that resolves to an array of the words from the dictionary.
 * @throws {Error} If there is an error fetching the data from the server.
 */
export const getDictionaryWords = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/dictionary/words`);
    return response?.data;
  } catch (error) {
    throw new Error('Failed to fetch dictionary words.');
  }
};

/**
 * Fetches dictionary word objects (words, descriptions, translations) from the server.
 *
 * @param words - An array of words to fetch data for.
 * @returns A promise that resolves to an array of IFormattedDictionaryWord, or null if no words are provided.
 */
export const fetchDictionaryWordsData = async (
  words: string[],
): Promise<IFormattedDictionaryWord[] | null> => {
  // const parameters = ['banana', 'banality'];
  if (words) {
    const parameters = words.join(',');
    const url = `${BASE_URL}/dictionary?words=${parameters}`;
    const response = await axios.get(url);
    return response?.data;
  }

  return null;
};

/**
 * Creates a new user by sending a POST request to the server with the provided user information.
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns - A Promise that resolves with an AxiosResponse if successful,
 * or an AxiosError if the request encounters an error.
 */
export const createUser = async (
  username: string,
  email: string,
  password: string,
): Promise<AxiosResponse | AxiosError> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/register`,
      { username, email, password },
      config,
    );

    return response;
  } catch (error) {
    return error as AxiosError;
  }
};

/**
 * Logs in a user by sending a GET request to the server with the provided login credentials.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns - A Promise that resolves with the AxiosResponse (containing user related data) if successful,
 * or an AxiosError if the login request encounters an error.
 */
export const loginUser = async (
  username: string,
  password: string,
): Promise<AxiosResponse | AxiosError> => {
  try {
    const url = `${BASE_URL}/users/login?reqUsername=${username}&reqPassword=${password}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error as AxiosError;
  }
};

// TODO: Temporary session restore function that has to be changed for token authentication.
export const reloadUserSession = async (
  _id: string,
  username: string,
  email: string,
): Promise<AxiosResponse | AxiosError> => {
  try {
    const url = `${BASE_URL}/users/reloadSession?reqId=${_id}&reqUsername=${username}&reqEmail=${email}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error as AxiosError;
  }
};

/**
 * Adds or updates a word from the list.
 */
export const addWordToUserList = async (
  userId: string,
  wordObject: IWord,
): Promise<AxiosResponse | AxiosError> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/addWord?userId=${userId}`,
      { wordObject },
      config,
    );

    return response;
  } catch (error) {
    return error as AxiosError;
  }
};
