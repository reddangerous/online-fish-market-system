import React, { useState } from 'react';
import supabase from '../supabase';

const UsersTable = ({ users, fetchUsers }) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    location: '',
  });

  const handleAddUser = async () => {
    try {
      const { data, error } = await supabase.from('users').insert(newUser);
      if (error) {
        console.error('Error adding user:', error);
      } else {
        console.log('User added:', data);
        setNewUser({ name: '', email: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const { data, error } = await supabase.from('users').delete().eq('id', id);
      if (error) {
        console.error('Error deleting user:', error);
      } else {
        console.log('User deleted:', data);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add User</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="First Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Last Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Role"
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Location"
          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" onClick={handleAddUser}>
        Add User
      </button>
    </div>
  );
};

export default UsersTable;
