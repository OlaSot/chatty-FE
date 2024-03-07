import { jwtDecode } from 'jwt-decode';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../../utils/constants';

const DecodeAccessToken = (accessToken) => {
  try {
    return jwtDecode(accessToken);
  } catch (error) {
    console.error('Error decoding access token:', error.message);
    localStorage.removeItem(JWT_ACCESS_TOKEN);
    localStorage.removeItem(JWT_REFRESH_TOKEN);
    window.location.href = '/login';
    return null;
  }
};

export default DecodeAccessToken;
