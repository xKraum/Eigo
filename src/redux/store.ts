import { configureStore } from '@reduxjs/toolkit';

import categoriesReducer from './features/user/categoriesSlice';
import preferencesReducer from './features/user/preferencesSlice';
import userReducer from './features/user/userSlice';
import wordsReducer from './features/user/wordsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    preferences: preferencesReducer,
    user: userReducer,
    words: wordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
