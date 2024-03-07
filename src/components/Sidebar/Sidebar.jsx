import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMe } from '../Api';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [emailName, setEmailName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setEmailName(
          userData.name
            ? userData.name
            : `${userData.email.substring(0, userData.email.lastIndexOf('@'))}`,
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return null;
  }

  const emailParts = user.email.split('@');
  const username = user.name || emailParts[0];
  const defaultUserPhotoUrl =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <div className='sidebar'>
      <div className='container'>
        <div className='sidebar__section'>
          <div className='user-info'>
            <div className='user__img'>
              <img
                src={user.avatarUrl || defaultUserPhotoUrl}
                alt={`${username}`}
              />
            </div>
            <p>{emailName}</p>
          </div>
          <div className='menu'>
            <Link
              to='/homeblog'
              className={`menu-item ${location.pathname === '/homeblog' ? 'active' : ''}`}
            >
              <img src='/UserProfile/newspaper-folded.svg' alt='NewsFeed' />
              <span>News Feed</span>
            </Link>

            <Link
              to='/draft'
              className={`menu-item ${location.pathname === '/draft' ? 'active' : ''}`}
            >
              <img src='/UserProfile/draft1.svg' alt='Drafts' />
              <span>My drafts</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
