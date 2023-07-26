import { IFormattedWordEntry } from '../interfaces/formattedDictionary/IFormattedDictionary';
import { IUserAuthInfo } from '../interfaces/user/IUser';
import { fetchDictionaryWordsData, getDictionaryWords } from '../services/api';
import { getWordsFromWordEntries } from '../utils/objectUtil';

enum CachedKey {
  WordList = 'dictionaryWords',
  WordDefinitionList = 'dictionary',
  UserAuthentication = 'userAuthInfo',
}

const getCachedObject = (itemName: string): object | null => {
  const item = localStorage.getItem(itemName);
  if (item) {
    return JSON.parse(item);
  }

  return null;
};

/**
 * Retrieves the dictionary words either from the localStorage cache or by calling the 'dictionary/words' service.
 * @returns An array of strings containing the dictionary words.
 */
export const getDictionaryWordsCached = async (): Promise<string[]> => {
  // Get words from localStorage
  let dictionaryWords = getCachedObject(CachedKey.WordList) as string[];

  if (!dictionaryWords) {
    // If there are no words cached, get them by calling the service.
    dictionaryWords = await getDictionaryWords();

    // If we got words from the service, add them to the localStorage
    if (dictionaryWords && dictionaryWords?.length) {
      localStorage.setItem(CachedKey.WordList, JSON.stringify(dictionaryWords));
    }
  }

  return dictionaryWords;
};

const setDictionaryWordsToCache = (
  cachedEntries: IFormattedWordEntry[] | null,
  newEntries: IFormattedWordEntry[] | null | undefined,
) => {
  const updatedEntries: IFormattedWordEntry[] = [];

  if (cachedEntries?.length) {
    updatedEntries.push(...cachedEntries);
  }

  if (newEntries?.length) {
    updatedEntries.push(...newEntries);
  }

  // Save the cached dictionary words
  if (updatedEntries?.length) {
    localStorage.setItem(
      CachedKey.WordDefinitionList,
      JSON.stringify(updatedEntries),
    );
  }
};

export const getDictionaryWordsDataCached = async (
  wordsToSearch: string[],
): Promise<IFormattedWordEntry[]> => {
  const wordEntries: IFormattedWordEntry[] = [];
  const cachedWordEntries = getCachedObject(
    CachedKey.WordDefinitionList,
  ) as IFormattedWordEntry[];
  let fetchedWords;

  // If the entries retrieved from localStorage are not null
  if (cachedWordEntries) {
    const cachedWords: string[] = getWordsFromWordEntries(cachedWordEntries);
    const nonCachedWords: string[] = [];

    // For each word, add the entry to wordEntries if it's already cached
    // or add the word to nonCachedWords array to fetch the entries later.
    wordsToSearch.forEach((wordToSearch) => {
      if (cachedWords.includes(wordToSearch)) {
        wordEntries.push(cachedWordEntries[cachedWords.indexOf(wordToSearch)]);
      } else {
        nonCachedWords.push(wordToSearch);
      }
    });

    // If there are words in nonCachedWords, add them to the fetchedWords object.
    if (nonCachedWords?.length) {
      fetchedWords = await fetchDictionaryWordsData(nonCachedWords);
    }
  }

  // If cached entries are null, perform a search with the wordsToSearch parameter
  else if (wordsToSearch?.length) {
    fetchedWords = await fetchDictionaryWordsData(wordsToSearch);
  }

  // If any word has been fetched, add it to the entry array.
  if (fetchedWords && fetchedWords?.length) {
    wordEntries.push(...fetchedWords);
  }

  setDictionaryWordsToCache(cachedWordEntries, fetchedWords);

  return wordEntries;
};

export const getUserAuthInfoCached = (): IUserAuthInfo => {
  const userAuthInfo = getCachedObject(
    CachedKey.UserAuthentication,
  ) as IUserAuthInfo;
  return userAuthInfo || null;
};

export const setUserAuthInfoToCache = (userAuthInfo: IUserAuthInfo): void => {
  if (userAuthInfo) {
    localStorage.setItem(
      CachedKey.UserAuthentication,
      JSON.stringify(userAuthInfo),
    );
  }
};

export const removeUserAuthInfoFromCache = () => {
  localStorage.removeItem(CachedKey.UserAuthentication);
};
