import { useEffect } from 'react';
import { useAuth } from '../../components/AuthContext/index';
// import { useNavigate } from 'react-router-dom';

const useTokenValidation = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!user) {
      // Перенаправляем пользователя на страницу логина
      window.location.href = '/login';
    }
  }, [user, isLoading]);

  // Возвращаем null, так как эффект в данном случае не возвращает компонент
  return null;
};

export default useTokenValidation;
