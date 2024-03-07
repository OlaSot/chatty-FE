import React from 'react';
import { useBlogContext } from 'BlogContext';

const Suggestions = () => {
  const { postsData } = useBlogContext();
  const uniqueUsersById = new Map();
  postsData.posts.forEach((post) => {
    if (!uniqueUsersById.has(post.user.id)) {
      uniqueUsersById.set(post.user.id, post.user);
    }
  });

  const uniqueUsers = Array.from(uniqueUsersById.values()).slice(0, 4);
  const defaultUserPhotoUrl =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <div className='suggestions'>
      <div className='container'>
        <div className='suggestions__section'>
          <h2>Suggestions</h2>
          <ul className='suggestions__items'>
            {uniqueUsers.map((user) => (
              <li key={user.id} className='suggestion-item'>
                <div className='user-info'>
                  <div className='user-info__avatar'>
                    <img
                      src={user.avatarUrl || defaultUserPhotoUrl}
                      alt={user.email}
                    />
                  </div>
                  <span>
                    {user.name && user.surname
                      ? `${user.name} ${user.surname}`
                      : user.email.substring(0, user.email.lastIndexOf('@'))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
