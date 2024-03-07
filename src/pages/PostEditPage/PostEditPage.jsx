import React from 'react';
import EditPost from 'components/EditPost/EditPost';
import {useParams} from 'react-router-dom';


const PostEditPage = () => {
  const {id} = useParams();

  return (
   
      <EditPost postId={id} />
    
  );
};

export default PostEditPage;
