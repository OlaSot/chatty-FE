import React, { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getMyPosts } from '../../components/Api';
import Post from '../../components/Post/Post';
import Sidebar from 'components/Sidebar/Sidebar';
import Suggestions from 'components/Suggestions/Suggestions';
import PostHeader from 'components/PostHeader/PostHeader';
import { useBlogContext } from 'BlogContext';
import PostCreationForm from 'components/PostCreationForm';

const Draft = () => {
  const { showPostForm, setShowPostForm, onUpdatePosts } = useBlogContext();
  const [draftPosts, setDraftPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMe();
        const userId = userData.id;

        const response = await getMyPosts(userId);
        const draftPosts = response.filter((post) => post.draft === true);
        setDraftPosts(draftPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const memoizedPosts = useMemo(() => {
    return draftPosts.map((post) => (
      <Post
        key={post.id}
        post={post}
        showFullText={false}
        onClick={() => navigate(`/posts/${post.id}/edit`)}
      />
    ));
  }, [draftPosts, navigate]);

  return (
    <div className='draft home-page' data-test='draft-component'>
      <div className='container'>
        <PostHeader leftText={'My drafts'} rightText={'Create a post'} />

        {showPostForm && (
          <PostCreationForm
            setShowPostForm={setShowPostForm}
            onUpdatePosts={onUpdatePosts}
          />
        )}
        <div className='draft__section'>
          <div className='draft__posts' data-test='draft-posts'>
            {memoizedPosts.length > 0 ? (
              memoizedPosts
            ) : (
              <p>Here can be your posts...</p>
            )}
          </div>
        </div>
      </div>
      <Sidebar />
      <Suggestions />
    </div>
  );
};

export default Draft;
