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
 * Sort an array of IWord objects based on their word property (case-insensitive).
 * @param words - The array of IWord objects to be sorted.
 * @param reverse - If true, the sorting will be in descending order (default is false for ascending order).
 * @returns A new array of IWord sorted by word name.
 */
export const sortByWordName = (words: IWord[], reverse = false): IWord[] => {
  const compareWords = (a: IWord, b: IWord) => {
    const wordA = a.word ? a.word.toLowerCase() : '';
    const wordB = b.word ? b.word.toLowerCase() : '';

    if (wordA < wordB) {
      return reverse ? 1 : -1;
    }
    if (wordA > wordB) {
      return reverse ? -1 : 1;
    }
    return 0;
  };

  const sortedWords = [...words].sort(compareWords);
  return sortedWords;
};
