import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMe } from '../Api';
import { useAuth } from 'components/AuthContext';
import decodeAccessToken from 'components/DecodeToken/DecodeToken';
import { JWT_ACCESS_TOKEN } from '../../utils/constants';

const Header = () => {
  const { user, logout } = useAuth();
  const [helloMessage, setHelloMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const decodedToken = decodeAccessToken(
    localStorage.getItem(JWT_ACCESS_TOKEN),
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          console.log('====== Header user:', user);
          const userData = await getMe();
          console.log('====== Header await getMe()', userData);
          const userName =
            userData.name ||
            userData.email
              .substring(0, userData.email.lastIndexOf('@'))
              .slice(0, 12) +
              (userData.email.substring(0, userData.email.lastIndexOf('@'))
                .length > 12
                ? '...'
                : '');

          setHelloMessage(userName);
        } else {
          setHelloMessage('');
          setMenuOpen(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className='header'>
        <div className='container'>
          <div className='header-box'>
            <div className='header__logo'>
              <Link to='/homeblog'>
                <img src='/Header/logo1.svg' alt='Logo' />
              </Link>
              <div className='burger' onClick={() => setMenuOpen(!menuOpen)}>
                &#9776;
              </div>
            </div>
            <nav
              className={
                menuOpen ? 'header__nav open' : 'header__nav header__menu'
              }
            >
              <ul className='header__nav-list'>
                <li>
                  <Link to='/homeblog' onClick={() => setMenuOpen(!menuOpen)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to='/about' onClick={() => setMenuOpen(!menuOpen)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to='/contact' onClick={() => setMenuOpen(!menuOpen)}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
            <div
              className={
                menuOpen ? 'header__user open' : 'header__user header__menu'
              }
            >
              {user ? (
                <p>Hello, {helloMessage || 'user'}! &#9660;</p>
              ) : (
                <p>Hello, {helloMessage || 'user'}!</p>
              )}
              {user ? (
                <>
                  <div className='dropdown-menu'>
                    <ul>
                      <li>
                        <Link
                          to='/userprofile'
                          onClick={() => setMenuOpen(!menuOpen)}
                        >
                          Your Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='/draft'
                          onClick={() => setMenuOpen(!menuOpen)}
                        >
                          My Drafts
                        </Link>
                      </li>
                      {decodedToken && decodedToken.role === 'ADMIN' && (
                        <li>
                          <Link
                            to='/users'
                            onClick={() => setMenuOpen(!menuOpen)}
                          >
                            Admin Panel
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link to='/login' onClick={handleLogout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
