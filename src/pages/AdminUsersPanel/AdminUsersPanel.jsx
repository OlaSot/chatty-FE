import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUsersEmail, deleteUser } from '../../components/Api';

const AdminUsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);
  const limit = 10;

  const [searchInput, setSearchInput] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(true);
  const navigate = useNavigate();

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      let loadedUsers = await getUsersEmail(
        searchInput,
        (page - 1) * limit,
        limit,
      );

      setUsers((prevUsers) => [...prevUsers, ...loadedUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchInput]);

  useEffect(() => {
    if (searchEmail.trim() === '') {
      setSearchInput(searchEmail);
      setUsers([]);
      setShowLoadMoreButton(true);
      setSearchTrigger(true);
    }
  }, [searchEmail]);

  useEffect(() => {
    if (searchTrigger) {
      fetchUsersData();
      setSearchInput('');
      setSearchTrigger(false);
    }
  }, [searchTrigger, fetchUsersData]);

  const handleSearchByEmail = () => {
    if (searchEmail.trim() !== '') {
      setSearchTrigger(true);
      setUsers([]);
      setPage(1);
      setShowLoadMoreButton(false);
      setSearchInput(searchEmail);
    } else {
      setUsers([]);
      setPage(1);
      setShowLoadMoreButton(true);
      setSearchInput('');
      setSearchTrigger(true);
    }
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
    setSearchTrigger(true);
  };

  return (
    <div className='admin-panel__users' data-test='adminPanelUsers'>
      <div className='container'>
        <div className='admin-panel__users-section'>
          <h1 data-test='adminPanelTitle'>Admin panel</h1>

          <div className='search-email'>
            <input
              type='text'
              // value={searchEmail}
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

          {showLoadMoreButton && !searchInput && (
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
