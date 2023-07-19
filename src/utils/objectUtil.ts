import { IFormattedWordEntry } from '../interfaces/formattedDictionary/IFormattedDictionary';

/**
 * @param wordEntries The array of IFormattedWordEntry.
 * @returns A string array with the words from the IFormattedWordEntry array.
 */
export const getWordsFromWordEntries = (
  wordEntries: IFormattedWordEntry[],
): string[] => {
  const words = wordEntries.reduce(
    (accumulator: string[], entry: IFormattedWordEntry) => {
      const { word } = entry;
      return [...accumulator, word];
    },
    [],
  );

  return words;
};
