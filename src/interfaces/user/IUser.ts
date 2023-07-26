export interface ICategory {
  categoryId: number;
  name: string;
  icon: string;
}

export interface IWord {
  word: string;
  descriptionIndex: number;
  categoryId: number | null;
  level: number;
  lastCheckDate: number | null;
  totalAttempts: number | null;
  correctAnswersStreak: number | null;
  averageResponseTime: number | null;
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
