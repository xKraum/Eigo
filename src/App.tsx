import axios, { AxiosError, AxiosResponse } from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { getUserAuthInfoCached } from './cache/cache';
import ProtectedRoute from './components/ProtectedRoute';
import ModalAddWord from './components/modal/content/ModalAddWord';
import NavigationLayout from './components/navigation-layout/NavigationLayout';
import { NavigationRoutes } from './constants/navigation';
import { useUserDispatch } from './hooks/useUserDispatch';
import { IUser } from './interfaces/user/IUser';
import ListPage from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import { RootState } from './redux/store';
import { reloadUserSession } from './services/api';

const App: React.FC = () => {
  const { dispatchLoginUser } = useUserDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleWindowSizeChange = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  const isUserAuthCached = !!localStorage.getItem('userAuthInfo');
  useEffect(() => {
    const loadUserSessionIfStored = () => {
      // If user has no value but the authentication is cached, fetch the user data.
      if (!user && isUserAuthCached) {
        const { _id, username, email } = getUserAuthInfoCached() || {};
        if (_id && username && email) {
          // Get all the user data based on the user auth data.
          reloadUserSession(_id, username, email).then(
            (response: AxiosResponse | AxiosError) => {
              if (axios.isAxiosError(response)) {
                // TODO: Handle error
              } else if (response?.status === 200) {
                // Load user data into Redux.
                const userResponse = response?.data?.user as IUser;
                dispatchLoginUser(userResponse);
              }
            },
          );
        }
      }
    };

    loadUserSessionIfStored();
  }, [user, isUserAuthCached, dispatchLoginUser]);

  const renderPage = (
    element: React.ReactNode,
    isLoginElement?: boolean,
  ): JSX.Element => {
    return (
      <ProtectedRoute>
        {isLoginElement ? (
          element
        ) : (
          <NavigationLayout isMobile={isMobile}>
            <div className="content">{element}</div>
          </NavigationLayout>
        )}
      </ProtectedRoute>
    );
  };

  // Renders /login page if there is no user and its auth data is not cached.
  // Render selected page in page if there is user.
  // If there is no user but cached auth data is cached, show a ProgressSpinner while fetching user data.
  const isRenderPage = (!isUserAuthCached && !user) || user;
  return (
    <div className="App">
      {isRenderPage ? (
        <BrowserRouter>
          <Routes>
            <Route
              path={NavigationRoutes.home.path}
              element={renderPage('Home Page')}
            />
            <Route
              path={NavigationRoutes.exam.path}
              element={renderPage('Exam Page')}
            />
            <Route
              path={NavigationRoutes.list.path}
              element={renderPage(<ListPage />)}
            />
            <Route
              path={NavigationRoutes.categories.path}
              element={renderPage('Categories Page')}
            />
            <Route
              path={NavigationRoutes.login.path}
              element={renderPage(<LoginPage />, true)}
            />
            <Route path="*" element={<ProtectedRoute />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <ProgressSpinner />
      )}
      {user && <ModalAddWord />}
    </div>
  );
};

export default App;
