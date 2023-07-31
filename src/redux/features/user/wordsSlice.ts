import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IWord } from '../../../interfaces/user/IUser';

const initialState: { words: IWord[] } = {
  words: [],
};

const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    addWord: (state, action: PayloadAction<IWord>) => {
      state.words.push(action.payload);
    },
    setWords: (state, action: PayloadAction<IWord[]>) => {
      state.words = [...action.payload];
    },
    updateWord: (state, action: PayloadAction<IWord>) => {
      const { word, entries } = action.payload;
      const wordIndex = state.words.findIndex((w) => w.word === word);

      if (wordIndex !== -1) {
        const updatedWord: IWord = {
          ...state.words[wordIndex],
          entries,
        };

        state.words[wordIndex] = updatedWord;
      }
    },
    clearWords: () => initialState,
  },
});

export const { addWord, setWords, updateWord, clearWords } = wordsSlice.actions;
export default wordsSlice.reducer;
