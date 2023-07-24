interface ICategory {
  categoryId: number;
  name: string;
  icon: string;
}

interface IWord {
  word: string;
  descriptionIndex: number;
  categoryId: number;
  level: number;
  lastCheckDate: number;
  totalAttempts: number | null;
  correctAnswersStreak: number | null;
  averageResponseTime: number | null;
}

export interface IUser {
  username: string;
  email: string;
  preferences: any; // TODO: Add the correct interface when the attributes are defined.
  categories: ICategory[];
  words: IWord[];
}
