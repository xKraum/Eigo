import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICategory } from '../../../interfaces/user/IUser';

const initialState: { categories: ICategory[] } = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<ICategory>) => {
      state.categories.push(action.payload);
    },
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = [...action.payload];
    },
    clearCategories: () => initialState,
  },
});

export const { addCategory, setCategories, clearCategories } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
