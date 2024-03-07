import axios from 'axios';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../utils/constants';

axios.defaults.headers.common['Accept'] = 'application/json';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(JWT_ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      const refreshToken = localStorage.getItem(JWT_REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const tokenResponse = await api.post('/api/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            tokenResponse.data;
          localStorage.setItem(JWT_ACCESS_TOKEN, accessToken);
          localStorage.setItem(JWT_REFRESH_TOKEN, newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem(JWT_ACCESS_TOKEN);
          localStorage.removeItem(JWT_REFRESH_TOKEN);
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      } else {
        console.error('Refresh token not found');
        localStorage.removeItem(JWT_ACCESS_TOKEN);
        localStorage.removeItem(JWT_REFRESH_TOKEN);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

const getPosts = async (skip, limit) => {
  const response = await api.get('/api/posts', { params: { skip, limit } });
  return response.data;
};

const getMyPosts = async (user_id) => {
  const response = await api.get(`/api/users/${user_id}/posts`);
  return response.data;
};

const deletePost = async (postId, config = {}) => {
  const response = await api.delete(`/api/posts/${postId}`, config);
  return response.data;
};

const createPost = async (postData) => {
  const response = await api.post('/api/posts', postData);
  return response.data;
};

const updatePost = async (postData, postId) => {
  try {
    const response = await api.put(`/api/posts/${postId}`, postData);
    const updatePost = response.data;

    return updatePost;
  } catch (error) {
    console.error('Error updating post:', error.message);
    throw error;
  }
};

const getUserPosts = async (userId, skip, limit) => {
  const response = await api.get(`/api/users/${userId}/posts`, {
    params: { skip, limit },
  });
  return response.data;
};

const getMe = async () => {
  const response = await api.get(`/api/me`);
  return response.data;
};

const getPostById = async (postId) => {
  try {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error.message);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error userData Update', error.message);
    throw error;
  }
};

const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/api/user/password/update', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error password update:', error.message);
    throw error;
  }
};

const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error creating feedback:', error.message);
    throw error;
  }
};

const getUsers = async (skip, limit) => {
  try {
    const response = await api.get('/api/users', { params: { skip, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

const getUsersEmail = async (email, skip, limit) => {
  try {
    const response = await api.get('/api/users', {
      params: { email, skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

export default api;
export {
  createPost,
  deletePost,
  getUserPosts,
  getMe,
  getMyPosts,
  getPosts,
  getPostById,
  updatePost,
  updateUser,
  updatePassword,
  createFeedback,
  getUsers,
  getUsersEmail,
  deleteUser,
};
