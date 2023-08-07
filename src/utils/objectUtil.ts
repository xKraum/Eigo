import { IFormattedDictionaryWord } from '../interfaces/formattedDictionary/IFormattedDictionary';
import { IWord, IWordData } from '../interfaces/user/IUser';

/**
 * Retrieves a dictionary word object (IFormattedDictionaryWord) from an array based on the word name.
 *
 * @param {IFormattedDictionaryWord[]} dictionaryWords - An array of dictionary word objects.
 * @param {string} word - The word to search for in the dictionaryWords array.
 * @returns {IFormattedDictionaryWord | undefined} The matching dictionary word entry if found, otherwise undefined.
 */
const getDictionaryWordByName = (
  dictionaryWords: IFormattedDictionaryWord[],
  word: string,
): IFormattedDictionaryWord | undefined => {
  const index = dictionaryWords.findIndex(
    ({ word: dictionaryWordName }) => dictionaryWordName === word,
  );

  return index !== -1 ? dictionaryWords[index] : undefined;
};

/**
 * Updates the description entries from the user's words array with the description and translation attributes of the dictionary words.
 * The word name is added to the IWordData entries.
 *
 * @async
 * @param {IWord[]} userWords - An array of user's words containing entries to be updated.
 * @param {IFormattedDictionaryWord[]} dictionaryWords - The dictionary words with the descriptions and translations to be used for updating.
 * @returns {Promise<IWord[]>} - A Promise that resolves to an array of updated user words with entries merged from the dictionary.
 */
export const getUpdatedUserWords = async (
  userWords: IWord[],
  dictionaryWords: IFormattedDictionaryWord[],
): Promise<IWord[]> => {
  const updatedUserWords = userWords.map((userWord) => {
    const dictionaryWord = getDictionaryWordByName(
      dictionaryWords,
      userWord.word,
    );

    if (dictionaryWord?.entries?.length) {
      const userWordEntries = userWord.entries.map((entry): IWordData => {
        const dictionaryDescriptionEntry =
          dictionaryWord.entries?.[entry.descriptionIndex];

        if (dictionaryDescriptionEntry) {
          const { description, translations } = dictionaryDescriptionEntry;
          return { ...entry, word: userWord.word, description, translations };
        }
        return { ...entry, word: userWord.word };
      });

      return { ...userWord, entries: userWordEntries };
    }

    return userWord;
  });

  return updatedUserWords;
};

/**
 * Extracts and returns an array of IWordData entries from an array of IWord objects.
 *
 * @param words - The array of IWord objects.
 * @returns An array of IWordData entries.
 */
export const getWordDataEntries = (words: IWord[]) => {
  const wordDataEntries = words.reduce(
    (accumulator: IWordData[], word: IWord) => {
      if (word?.entries?.length) {
        return [...accumulator, ...word.entries];
      }
      return [...accumulator];
    },
    [],
  );

  return wordDataEntries;
};

/**
 * Sort an array of IWordData objects based on their 'word' property (case-insensitive).
 * @param words - The array of IWordData objects to be sorted.
 * @param ascending - If true, the sorting will be in ascending order.
 * @returns A new array of IWordData sorted by word name.
 */
const sortByWordName = (words: IWordData[], ascending = true): IWordData[] => {
  const compareWords = (a: IWordData, b: IWordData) => {
    const wordA = a.word ? a.word.toLowerCase() : '';
    const wordB = b.word ? b.word.toLowerCase() : '';

    if (wordA === wordB) {
      return 0;
    }

    return ascending ? wordA.localeCompare(wordB) : wordB.localeCompare(wordA);
  };

  const sortedWords = [...words].sort(compareWords);
  return sortedWords;
};

/**
 * Sort an array of IWordData objects based on their 'level' property (ascending or descending).
 *
 * @param words - The array of IWordData objects to be sorted.
 * @param ascending - If true, the sorting will be in ascending order.
 * @returns A new array of IWordData sorted by word level.
 */
const sortWordDataByWordLevel = (
  words: IWordData[],
  ascending = true,
): IWordData[] => {
  const compareWords = (a: IWordData, b: IWordData) => {
    const levelA = a.level ?? 0;
    const levelB = b.level ?? 0;

    if (levelA === levelB) {
      return 0;
    }

    return ascending ? levelB - levelA : levelA - levelB;
  };

  const sortedWordData = [...words].sort(compareWords);
  return sortedWordData;
};

/**
 * Sorts an array of IWordData objects based on the provided sorting options.
 *
 * @param wordDataList - The array of IWordData objects to be sorted.
 * @param isAlphabetical - If true, sort by word name, if false, sort by word level.
 * @param isAscending - If true, the sorting will be in ascending order.
 * @returns A new array of IWordData sorted based on the chosen sorting options.
 */
export const getListSorted = (
  wordDataList: IWordData[],
  isAlphabetical: boolean,
  isAscending: boolean,
): IWordData[] => {
  const wordDataListCopy = [...wordDataList];
  return isAlphabetical
    ? sortByWordName(wordDataListCopy, isAscending)
    : sortWordDataByWordLevel(wordDataListCopy, isAscending);
};
