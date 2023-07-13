import { IFormattedWordEntry } from '../interfaces/formattedDictionary/IFormattedDictionary';

/**
 * Retrieves the dictionary words either from the localStorage cache or by reducing the dictionaryWordsObject.
 * @param dictionaryWordsObject - The formatted array of words from the dictionary with their descriptions and translations.
 * @returns An array of strings containing the dictionary words.
 */
export const getDictionaryWordsCached = (
  dictionaryWordsObject: IFormattedWordEntry[],
): string[] => {
  let dictionaryWords: string[] = [];

  // Get words from localStorage
  const storedWords = localStorage.getItem('dictionaryWords');
  if (storedWords) {
    dictionaryWords = JSON.parse(storedWords) as string[];
  } else if (dictionaryWordsObject && dictionaryWordsObject.length) {
    // If there are no words found, get them by reducing the dictionary parameter.
    dictionaryWords = dictionaryWordsObject.reduce(
      (accumulator: string[], wordEntry: IFormattedWordEntry) => {
        if (wordEntry?.word) {
          return [...accumulator, wordEntry.word.toLowerCase()];
        }
        return [...accumulator];
      },
      [],
    );

    // If we got words from the reduce, add them to the localeStorage
    if (dictionaryWords && dictionaryWords?.length) {
      localStorage.setItem('dictionaryWords', JSON.stringify(dictionaryWords));
    }
  }

  return dictionaryWords;
};
