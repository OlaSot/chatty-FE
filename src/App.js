import './assets/styles/main.scss';
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Registration from 'pages/Registration/Registration';
import Login from 'pages/Login/Login';
import HomeBlog from 'pages/HomeBlog/HomeBlog';
import About from 'pages/About/About';
import Contact from 'pages/Contact/Contact';
import Draft from 'pages/Draft/Draft';
import UserProfile from 'pages/UserProfile/UserProfile';
import RequireAuth from './components/AuthContext/require_auth';
import EditPost from 'components/EditPost/EditPost';
import PostEditPage from 'pages/PostEditPage/PostEditPage';
import AdminUsersPanel from 'pages/AdminUsersPanel/AdminUsersPanel';
import RedirectIfAuthenticated from 'components/AuthContext/redirect';
import UserPage from 'pages/UserPage';
import { BlogProvider } from './BlogContext';

const App = () => {
  const location = useLocation();
  const isHeaderVisible = ![
    '/',
    '/login/',
    '/registration/',
    '/login',
    '/user',
    '/registration',
  ].includes(location.pathname);


  return (
    <>
      {isHeaderVisible && <Header />}
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />

        <Route
          path='/registration'
          element={
            <RedirectIfAuthenticated>
              <Registration />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path='/homeblog'
          element={
            <RequireAuth>
              <BlogProvider>
                <HomeBlog />
              </BlogProvider>
            </RequireAuth>
          }
        />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route
          path='/draft'
          element={
            <BlogProvider>
              <Draft />
            </BlogProvider>
          }
        />

        <Route
          path='/userprofile'
          element={
            <RequireAuth>
              <BlogProvider>
                <UserProfile />
              </BlogProvider>
            </RequireAuth>
          }
          exact
        />

        <Route
          path='/userprofile/:userId'
          element={
            <RequireAuth>
              <BlogProvider>
                <UserProfile />
              </BlogProvider>
            </RequireAuth>
          }
        />

        <Route
          path='/posts/:id'
          element={
            <BlogProvider>
              <EditPost />
            </BlogProvider>
          }
        />
        <Route
          path='/posts/:id/edit'
          element={
            <BlogProvider>
              <PostEditPage />
            </BlogProvider>
          }
        />
        <Route
          path='/posts/:id/edit'
          element={
            <BlogProvider>
              <UserPage />
            </BlogProvider>
          }
        />
        <Route
          path='/users'
          element={
            <BlogProvider>
              <AdminUsersPanel />
            </BlogProvider>
          }
        />
      </Routes>
    </>
  );
};

export default App;

