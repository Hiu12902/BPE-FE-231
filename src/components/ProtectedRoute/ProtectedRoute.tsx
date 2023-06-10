import { ACCESS_TOKEN } from '@/constants/localStorageKeys';
import useAutoSaveModels from '@/core/hooks/useAutoSaveModels';
import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const [searchParam] = useSearchParams();
  const token = searchParam.get('token');
  const navigate = useNavigate();
  useAutoSaveModels();

  useEffect(() => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(token));
      navigate('/');
    }
  }, []);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
