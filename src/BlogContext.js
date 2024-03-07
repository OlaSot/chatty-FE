import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { JWT_ACCESS_TOKEN } from 'utils/constants';
import {
  getMe,
  getPostById,
  getPosts,
  getUserPosts,
  updatePost,
} from 'components/Api';
import decodeAccessToken from './components/DecodeToken/DecodeToken';

const BlogContext = createContext();

export const useBlogContext = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {

  const [postsData, setPostsData] = useState({ posts: [], page: 1 });
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);
  const [userData, setUserData] = useState(null);
  const observerRef = useRef(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  let userId;

  const accessToken = localStorage.getItem(JWT_ACCESS_TOKEN);
  console.log('accessToken:', accessToken);

  if (accessToken) {
    try {
      const decodedToken = decodeAccessToken(
        localStorage.getItem(JWT_ACCESS_TOKEN),
      );
      userId = decodedToken.sub;
    } catch (error) {
      console.error('Ошибка декодирования JWT:', error);
    }
  }


  const limit = 10;


  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMorePosts || !accessToken) return;
    setLoading(true);

    try {
      const skip = postsData.page * limit;
      let newPosts;

      if (showOnlyUserPosts && userId) {
        newPosts = await getUserPosts(userId, skip, limit);
      } else {
        newPosts = await getPosts(skip, limit);
      }


      const filteredPosts = newPosts.filter(
        (newPost) =>
          !postsData.posts.some(
            (existingPost) => existingPost.id === newPost.id,
          ),
      );

      if (filteredPosts.length > 0) {

        setPostsData((prevState) => ({
          ...prevState,
          posts: [...prevState.posts, ...filteredPosts],
          page: prevState.page + 1,
        }));
      }

      if (newPosts.length < limit) {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMorePosts,
    accessToken,
    postsData,
    showOnlyUserPosts,
    userId,
  ]);


  const onUpdatePosts = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const skip = 0;
      let fetchedPosts;

      if (showOnlyUserPosts) {
        fetchedPosts = await getUserPosts(userId, skip, limit);
      } else {
        fetchedPosts = await getPosts(skip, limit);
      }

      setPostsData((prevState) => ({
        posts: [...fetchedPosts],
        page: 1,
      }));

      if (fetchedPosts.length < limit) {
        setHasMorePosts(false);
      } else {
        setHasMorePosts(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error updating posts:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPostsData, showOnlyUserPosts, userId, accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedPosts;
        if (showOnlyUserPosts) {

          fetchedPosts = await getUserPosts(userId, 0, limit);
        } else {

          fetchedPosts = await getPosts(0, limit);

        }

        setPostsData({ posts: fetchedPosts, page: 1 });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showOnlyUserPosts, userId]);

  useEffect(() => {
    setPostsData({ posts: [], page: 1 });
    setHasMorePosts(true);
    setLoading(false);
  }, [showOnlyUserPosts]);


  const [isChecked, setIsChecked] = useState(false);
  const [isTrue, setIsTrue] = useState(false);

  const handleCheckboxChange = (e) => {

    const checked = e.target.checked;

    setIsTrue(!isTrue);
    setIsChecked(checked);
    setShowOnlyUserPosts(checked);
  };


  const [editMode, setEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };


  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleClick = (rightText) => {
    if (rightText === 'Edit') {
      setEditMode((prev) => !prev);
    } else {
      setShowPostForm((show) => !show);
    }
  };


  useEffect(() => {
    console.log('>>>==== loading Posts', loading);
    console.log('>>>==== hasMorePosts Posts', hasMorePosts);
    if (loading || !hasMorePosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {

          loadMorePosts();
        } else {

        }
      },
      {
        rootMargin: '1000px',
      },
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, hasMorePosts, loadMorePosts, observerRef, showOnlyUserPosts]);

  const [post, setPost] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdatePost = async (updatedPost) => {
    setPostsData((prevState) => {
      const postIndex = prevState.posts.findIndex(
        (post) => post.id === updatedPost.id,
      );
      if (postIndex !== -1) {
        const updatedPosts = [...prevState.posts];
        updatedPosts[postIndex] = updatedPost;
        return {
          ...prevState,
          posts: updatedPosts,
        };
      } else {
        return {
          ...prevState,
          posts: [...prevState.posts, updatedPost],
        };
      }
    });
  };


  const handleEdit = async (postId) => {
    try {
      const fetchedPost = await getPostById(postId);
      setEditPostData(fetchedPost);
      setIsEditModalOpen(true);
      console.log('=====> Context fetchedPost =>', fetchedPost);
    } catch (error) {
      console.error('Ошибка при получении данных поста:', error);
    }
  };


  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = async (postData, postId) => {
    try {
      setIsSaving(true);
      const updatedPost = await updatePost(postData, postId);
      handleUpdatePost(updatedPost);
      setPost(updatedPost);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving edited post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        postsData,
        setPostsData,
        loading,
        setLoading,
        hasMorePosts,
        setHasMorePosts,
        showPostForm,
        setShowPostForm,
        showOnlyUserPosts,
        setShowOnlyUserPosts,
        onUpdatePosts,
        isTrue,
        setIsTrue,
        isChecked,
        handleCheckboxChange,
        observerRef,
        loadMorePosts,
        setIsChecked,
        handleClick,
        setEditMode,
        editMode,
        isPasswordModalOpen,
        openPasswordModal,
        closePasswordModal,
        handleUpdatePost,
        isSaving,
        setIsSaving,
        handleSave,
        handleCloseModal,
        post,
        isEditable,
        setIsEditable,
        setPost,
        isEditModalOpen,
        setIsEditModalOpen,
        handleEdit,
        setEditPostData,
        editPostData,
        userData,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
