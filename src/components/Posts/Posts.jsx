import React from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../Post/Post';
import { useBlogContext } from 'BlogContext';

const Posts = () => {
  const navigate = useNavigate();

  const {
    loading,
    postsData,
    observerRef,
  } = useBlogContext()


  return (
    <div className='posts' data-test='posts-component'>
      <div className='container'>
        <div className='posts__section'>

          {!loading &&
            Array.isArray(postsData?.posts) &&
            postsData.posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                showFullText={false}
                onClick={() => navigate(`/posts/${post.id}/edit`)}
              />
            ))}

        </div>
      </div>
      <div ref={observerRef} style={{ height: '20px' }}></div>
    </div>
  );
};

export default Posts;
