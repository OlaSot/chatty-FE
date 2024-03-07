import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Suggestions from '../../components/Suggestions/Suggestions';
import Posts from '../../components/Posts/Posts';
import PostHeader from '../../components/PostHeader/PostHeader';
import PostCreationForm from '../../components/PostCreationForm';
import { useBlogContext } from 'BlogContext';

const HomeBlog = () => {
  const { showPostForm, setShowPostForm, setShowOnlyUserPosts, onUpdatePosts } =
    useBlogContext();

  return (
    <div className='home-blog home-page' data-test='home-blog-component'>
      <PostHeader
        setShowOnlyUserPosts={setShowOnlyUserPosts}
        leftText={'Feed'}
        rightText={'Create a post'}
        showCheckbox={true}
      />
      {showPostForm && (
        <PostCreationForm
          setShowPostForm={setShowPostForm}
          onUpdatePosts={onUpdatePosts}
        />
      )}
      <Posts />
      <div className='left-side'>
        <Sidebar />
      </div>
      <Suggestions />
    </div>
  );
};

export default HomeBlog;
