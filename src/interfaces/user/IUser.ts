export interface ICategory {
  // categoryId: number;
  name: string;
  icon: string;
}

export interface IWordData {
  word?: string;
  description?: string;
  translations?: string[];
  descriptionIndex: number;
  categoryId: null;
  level: 0;
  lastCheckDate: null;
  totalAttempts: null;
  correctAnswersStreak: null;
  averageResponseTime: null;
}

export interface IWord {
  word: string;
  entries: IWordData[];
}

export interface IUserAuthInfo {
  _id: string;
  username: string;
  email: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  preferences: object; // TODO: Add the interface when the attributes are defined.
  categories: ICategory[];
  words: IWord[];
}
