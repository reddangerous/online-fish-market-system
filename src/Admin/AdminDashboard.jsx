import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import UsersTable from './UsesTable';
import OrdersTable from './OrdersTable';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users data:', error);
      } else {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users data:', error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase.from('order').select('*');
      if (error) {
        console.error('Error fetching orders data:', error);
      } else {
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders data:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <UsersTable users={users} fetchUsers={fetchUsers} />
      <OrdersTable orders={orders} fetchOrders={fetchOrders} />
    </div>
  );
};

export default AdminDashboard;
