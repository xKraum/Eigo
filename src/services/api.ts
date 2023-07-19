import axios from 'axios';
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
