import { useDispatch } from 'react-redux';
import { IUser } from '../interfaces/user/IUser';
import {
  clearCategories,
  setCategories,
} from '../redux/features/user/categoriesSlice';
import {
  clearPreferences,
  setPreferences,
} from '../redux/features/user/preferencesSlice';
import { clearUser, setUser } from '../redux/features/user/userSlice';
import { clearWords, setWords } from '../redux/features/user/wordsSlice';

export function useUserDispatch() {
  const dispatch = useDispatch();

  const dispatchLoginUser = (user: IUser) => {
    const { preferences, words, categories, ...userAuthInfo } = user;
    dispatch(setUser(userAuthInfo));
    dispatch(setPreferences(preferences));
    dispatch(setWords(words));
    dispatch(setCategories(categories));
  };

  const dispatchLogoutUser = () => {
    dispatch(clearUser());
    dispatch(clearPreferences());
    dispatch(clearWords());
    dispatch(clearCategories());
  };

  return { dispatchLoginUser, dispatchLogoutUser };
}
