import axios, { AxiosError, AxiosResponse } from 'axios';
import { IFormattedWordEntry } from '../interfaces/formattedDictionary/IFormattedDictionary';

// FIXME: To change, temporary private IP.
const BASE_URL = 'http://192.168.1.40:5000';

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
 * @returns A promise that resolves to an array of IFormattedWordEntry, or null if no words are provided.
 */
export const fetchDictionaryWordsData = async (
  words: string[],
): Promise<IFormattedWordEntry[] | null> => {
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
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

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
