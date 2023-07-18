import { getDictionaryWords } from '../services/api';

/**
 * Retrieves the dictionary words either from the localStorage cache or by calling the 'dictionary/words' service.
 * @returns An array of strings containing the dictionary words.
 */
export const getDictionaryWordsCached = async (): Promise<string[]> => {
  let dictionaryWords: string[] = [];

  // Get words from localStorage
  const storedWords = localStorage.getItem('dictionaryWords');
  if (storedWords) {
    dictionaryWords = JSON.parse(storedWords) as string[];
  } else {
    // If there are no words cached, get them by calling the service.
    dictionaryWords = await getDictionaryWords();

    // If we got words from the service, add them to the localStorage
    if (dictionaryWords && dictionaryWords?.length) {
      localStorage.setItem('dictionaryWords', JSON.stringify(dictionaryWords));
    }
  }

  return dictionaryWords;
};
