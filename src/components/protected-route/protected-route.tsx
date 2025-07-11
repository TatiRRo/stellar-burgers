import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedRouteProps } from './type';

const isAuthenticated = (): boolean => !!localStorage.getItem('accessToken');

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
