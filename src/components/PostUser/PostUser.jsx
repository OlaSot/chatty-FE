const PostUser = ({ user, post }) => {
  const defaultUserPhotoUrl =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  if (!user) {
    return null;
  }

  const calculateReadingTime = (text) => {
    const length = text.length;
    if (length < 100) return '1 minute';
    if (length >= 100 && length <= 400) return '3 minutes';
    if (length > 400 && length <= 700) return '5 minutes';
    return '>5 minutes';
  };
  const emailParts = user.email.split('@');
  const username = user.name || emailParts[0];
  const readingTime = calculateReadingTime(post.body);

  return (
    <div className='post-user'>
      <div className='post-user__top'>
        <div className='post-user__top__avatar'>
          <img
            src={user.avatarUrl || defaultUserPhotoUrl}
            alt={`${user.name}`}
          />
        </div>
        <span>{username}</span>
      </div>
      <div className='post-user__reading-time'>
        <p>Reading time:{readingTime}</p>
      </div>
    </div>
  );
};

export default PostUser;
