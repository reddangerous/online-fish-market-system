import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, password, role')
        .eq('email', email)
        .single();

      if (usersError || !users) {
        setAlertMessage('Login failed. Please check your credentials and try again.');
        setAlertType('danger');
      } else {
        const { id, email: fetchedEmail, password: fetchedPassword, role } = users;

        if (password === fetchedPassword) {
          // Set user role in local storage or cookie
          localStorage.setItem('userRole', role);

          // Redirect to profile account page based on role and pass the user ID
          if (role === 'buyer') {
            navigate(`/buyer/${id}`);
          } else if (role === 'seller') {
            navigate(`/seller/${id}`);
          }else  if (role === 'admin'){
            navigate(`/admin`);
          }
          
          
          setAlertMessage('Login successful!');
          setAlertType('success');
        } else {
          setAlertMessage('Login failed. Please check your credentials and try again.');
          setAlertType('danger');
        }
      }
    } catch (error) {
      console.error(error);
      setAlertMessage('Login failed. Please try again later.');
      setAlertType('danger');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {alertMessage && (
        <div className={`alert alert-${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
