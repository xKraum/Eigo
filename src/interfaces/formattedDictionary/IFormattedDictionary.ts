export interface IFormattedDescriptionEntry {
  description: string | undefined;
  translations: string[] | undefined;
}

export interface IFormattedDictionaryWord {
  word: string;
  entries: IFormattedDescriptionEntry[] | null;
}

export interface IFormattedDictionary {
  words: IFormattedDictionaryWord[];
}
