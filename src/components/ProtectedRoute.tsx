import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { NavigationRoutes } from '../constants/navigation';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children?: ReactNode;
}

/**
 * Component used to check if the URL is valid before returning the content passed by children props.
 * @returns The content passed by props.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children = null }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const isUserLoggedIn = !!user;

  const location = useLocation();

  const validPaths = Object.values(NavigationRoutes).map((route) => route.path);
  const isPathValid = validPaths.includes(location.pathname);

  // If path is not valid redirect to home.
  if (!isPathValid) {
    return <Navigate to={NavigationRoutes.home.path} replace />;
  }

  // If path is login and the user is already logged in redirect to home.
  if (isUserLoggedIn && location.pathname === NavigationRoutes.login.path) {
    return <Navigate to={NavigationRoutes.home.path} replace />;
  }

  // If path is not login and user is not logged in redirect to login.
  if (!isUserLoggedIn && location.pathname !== NavigationRoutes.login.path) {
    return <Navigate to={NavigationRoutes.login.path} replace />;
  }

  return children as React.ReactElement | null;
};

export default ProtectedRoute;
