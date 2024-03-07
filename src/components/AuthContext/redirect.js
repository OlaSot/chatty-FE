import { Navigate } from 'react-router-dom';
import { useAuth } from './index';

function RedirectIfAuthenticated({ children }) {
  const auth = useAuth();


  const savedAccessToken = localStorage.getItem('accessToken');


  if (auth.user || savedAccessToken) {
    return <Navigate to='/homeblog' />;
  }

  return children;
}
export default RedirectIfAuthenticated;
