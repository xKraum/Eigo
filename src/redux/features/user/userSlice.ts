import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUserAuthInfo } from '../../../interfaces/user/IUser';

const initialState: { user: IUserAuthInfo | null } = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserAuthInfo>) => {
      state.user = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
