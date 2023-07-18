import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

/**
 * Fetches dictionary words from the server.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of the words from the dictionary.
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
