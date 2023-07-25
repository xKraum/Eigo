import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import ProtectedRoute from './components/ProtectedRoute';
import ModalAddWord from './components/modal/content/ModalAddWord';
import NavigationLayout from './components/navigation-layout/NavigationLayout';
import { NavigationRoutes } from './constants/navigation';
import LoginPage from './pages/LoginPage';
import { RootState } from './redux/store';

const App: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleWindowSizeChange = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

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

  return (
    <div className="App">
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
            element={renderPage('List Page')}
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
      {user && <ModalAddWord />}
    </div>
  );
};

export default App;
