export interface IFormattedDescriptionEntry {
  description: string | null;
  translations: string[] | null;
}

export interface IFormattedWordEntry {
  word: string;
  entries: IFormattedDescriptionEntry[] | null;
}

export interface IFormattedDictionary {
  words: IFormattedWordEntry[];
}
