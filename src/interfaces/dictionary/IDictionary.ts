export interface ITranslation {
  name: string | null;
  gender: string | null;
  countries: string[];
}

interface ITranslations {
  es_ES: ITranslation[];
}

interface IDescriptionEntry {
  description: string | null;
  type: string | null;
  ipa: string | null;
  translations: ITranslations | null;
}

interface IWordEntry {
  word: string;
  entries: IDescriptionEntry[] | null;
}

export interface IDictionary {
  words: IWordEntry[];
}
