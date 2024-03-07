import React from 'react';
import PostPhoto from '../PostPhoto/PostPhoto';
import PostDescription from '../PostDescription/PostDescription';
import PostText from '../PostText/PostText';

const PostContent = ({ post, showFullText }) => {
  return (
    <div className='post-content'>
      <div className='post-content__header'>
        <PostPhoto photo={post.imageUrl} />
      </div>
      <div className='post-content__top'>
        <h3>{post.title}</h3>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <PostDescription description={post.description} />
      <PostText text={post.body} showFullText={showFullText} />
    </div>
  );
};

export default PostContent;
