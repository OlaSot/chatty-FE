import React from 'react';
import PostUser from '../PostUser/PostUser';
import PostContent from '../PostContent/PostContent';

const Post = ({ post, onClick, showFullText }) => {
  return (
    <div className='post' data-test='post' onClick={onClick}>
      <PostUser user={post.user} post={post} />
      <PostContent post={post} showFullText={showFullText} />
    </div>
  );
};

export default Post;
