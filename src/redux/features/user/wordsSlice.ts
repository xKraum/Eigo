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
    clearWords: () => initialState,
  },
});

export const { addWord, setWords, clearWords } = wordsSlice.actions;
export default wordsSlice.reducer;
