import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../Post/Post';
import { getPostById, deletePost, getMe } from '../Api';
import { useAuth } from '../AuthContext/index';
import PostEditModal from '../PostEditModal/PostEditModal';
import Bin from 'assets/delete.svg';
import Edit from 'assets/edit.svg';
import { useBlogContext } from 'BlogContext';

const EditPost = (props) => {
  console.log('props EditPost =>', props);

  const {
    setPostsData,
    handleUpdatePost,
    handleCloseModal,
    post,
    isEditModalOpen,
    setPost,
    isEditable,
    setIsEditable,
    setEditPostData,
    editPostData,
    handleEdit,
  } = useBlogContext();
  const { postId } = props;
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const fetchedPost = await getPostById(postId);
        const userMe = await getMe();

        setPost(fetchedPost);

        const newIsEditable =
          user && fetchedPost && userMe.id === fetchedPost.user.id;

        setIsEditable(newIsEditable);

        setEditPostData({
          title: fetchedPost.title,
          description: fetchedPost.description,
          body: fetchedPost.body,
          id: postId,
          currentImage: fetchedPost.imageUrl,
          draft: fetchedPost.draft,
        });
      } catch (error) {}
    };

    fetchPostData();
  }, [postId, user, setEditPostData, setIsEditable, setPost]);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      setPostsData((prevState) => ({
        ...prevState,
        posts: prevState.posts.filter((post) => post.id !== postId),
      }));
      navigate('/homeblog');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <>
      <div className='edit-post' data-test='edit-post'>
        <div className='container'>
          <div className='edit-post__section'>
            {post ? (
              <>
                <div className='post-content'>
                  <div className='post-content__top edit-button__box'>
                    {isEditable && (
                      <div className='edit-tools'>
                        <button
                          onClick={() => handleEdit(postId)}
                          data-test='edit-button'
                        >
                          <img
                            src={Edit}
                            alt='edit button'
                            className='edit-btns'
                          />
                        </button>
                        <button
                          onClick={handleDelete}
                          data-test='delete-button'
                        >
                          <img
                            src={Bin}
                            alt='delete button'
                            className='edit-btns'
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <Post
                    post={post}
                    isEditable={isEditable}
                    showFullText={true}
                  />
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <PostEditModal
          post={editPostData}
          onClose={handleCloseModal}
          onUpdatePost={handleUpdatePost}
        />
      )}
    </>
  );
};

export default EditPost;
