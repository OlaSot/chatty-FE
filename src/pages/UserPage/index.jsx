import React from 'react';
import s from './user.module.css';
import background from './flowerbouquet.png';
import CreatePostBtn from 'UI/CreatePostBtn';
import Header from 'components/Header/Header';
import Posts from 'components/Posts/Posts';
import Suggestions from 'components/Suggestions/Suggestions';

export default function UserPage() {
  const defaultUserPhotoUrl =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <div className={`${s.mainContainer} user-page`}>
      <Header />
      <div className={s.background}>
        <img src={background} alt='' />
      </div>
      <div className='container'>
        <div className={s.info_container}>
          <div className={s.user_info_container}>
            <div className={s.userPhoto}>
              <div className={s.img_container}>
                <img src={defaultUserPhotoUrl} alt='' />
              </div>
            </div>
            <div className={s.upperText}>
              <div className={s.middleText}>
                <p>Nick Shelbourne</p>
                <CreatePostBtn rightText={'Create a post'} />
              </div>
              <p className={s.numberPosts}>Number of posts</p>
            </div>
          </div>
        </div>
      </div>
      <Posts />
      <Suggestions />
    </div>
  );
}
