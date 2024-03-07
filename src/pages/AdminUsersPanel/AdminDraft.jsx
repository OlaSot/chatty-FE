import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUsers, getUsersEmail, deleteUser } from '../../components/Api';

const AdminUsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchEmail, setSearchEmail] = useState('');
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);
  const navigate = useNavigate();

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      let loadedUsers;

      if (searchEmail) {
        loadedUsers = await getUsersEmail(
          searchEmail,
          (page - 1) * limit,
          limit,
        );
      } else {
        loadedUsers = await getUsers((page - 1) * limit, limit);
      }
      setUsers((prevUsers) => [...prevUsers, ...loadedUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchEmail]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const handleSearchByEmail = () => {
    setUsers([]);
    setPage(1);
    fetchUsersData();
    setShowLoadMoreButton(false);
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    console.log(`userToEdit => `, userToEdit);
    navigate(`/userprofile/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find((user) => user.id === userId);
    console.log(`userToDelete => `, userToDelete);

    try {
      await deleteUser(userId);
      console.log(`user id ${userId} has been deleted!!!`);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className='admin-panel__users' data-test='adminPanelUsers'>
      <div className='container'>
        <div className='admin-panel__users-section'>
          <h1 data-test='adminPanelTitle'>Admin panel</h1>

          <div className='search-email'>
            <input
              type='text'
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder='Search by email...'
              data-test='searchEmailInput'
            />
            <button
              className='email-btn'
              onClick={handleSearchByEmail}
              data-test='searchEmailButton'
            >
              Search
            </button>
          </div>

          <h2 data-test='usersListTitle'>Users list</h2>
          <table data-test='usersTable'>
            <thead>
              <tr>
                <th data-test='tableHeaderNumber'>№</th>
                <th className='id-hide' data-test='tableHeaderID'>
                  Role
                </th>
                <th data-test='tableHeaderEmail'>Email</th>
                <th data-test='tableHeaderName'>Name</th>
                <th data-test='tableHeaderActions'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} data-test='userRow'>
                  <td data-test='userNumber'>{index + 1}</td>
                  <td className='id-hide' data-test='userRole'>
                    {user.role}
                  </td>
                  <td data-test='userEmail'>{user.email}</td>
                  <td data-test='userName'>{user.name}</td>
                  <td className='admin-panel__btn-box' data-test='userActions'>
                    <span
                      onClick={() => handleEditUser(user.id)}
                      data-test='editUserButton'
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span
                      onClick={() => handleDeleteUser(user.id)}
                      data-test='deleteUserButton'
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showLoadMoreButton && !searchEmail && (
            <button
              className='admin-btn'
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPanel;
