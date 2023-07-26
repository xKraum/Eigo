import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// TODO: Add the interface when the attributes are defined.
const initialState: { preferences: object } = {
  preferences: {},
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<object>) => {
      state.preferences = action.payload;
    },
    clearPreferences: () => initialState,
  },
});

export const { setPreferences, clearPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
