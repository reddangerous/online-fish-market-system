import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabase';

const Signup = () => {
  const emailRef = useRef(null);
  const otpRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const roleRef = useRef(null);
  const location = useRef(null);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      // Send OTP to verify email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: emailRef.current.value,
      });
      if (otpError) {
        console.error(otpError);
        setAlertMessage('Failed to send OTP. Please try again later.');
        setAlertType('danger');
        return;
      }

      setIsEmailSent(true);
      setAlertMessage('An OTP has been sent to your email. Please check your inbox.');
      setAlertType('success');
    } catch (error) {
      console.error(error);
      setAlertMessage('Failed to send OTP. Please try again later.');
      setAlertType('danger');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      // Verify email using OTP
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: emailRef.current.value,
        token: otpRef.current.value,
        type: 'email',
      });
      if (otpError) {
        console.error(otpError);
        setAlertMessage('Email verification failed. Please check the OTP and try again.');
        setAlertType('danger');
        return;
      }

      setIsEmailVerified(true);
      setAlertMessage('Email verified successfully!');
      setAlertType('success');
    } catch (error) {
      console.error(error);
      setAlertMessage('Email verification failed. Please check the OTP and try again.');
      setAlertType('danger');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;
      const firstName = firstNameRef.current.value;
      const lastName = lastNameRef.current.value;
      const role = roleRef.current.value;
      const location = location.current.value;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        setAlertMessage('Passwords do not match. Please try again.');
        setAlertType('danger');
        return;
      }
  
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();
      if (existingUser) {
        setAlertMessage('User already exists. Please use a different email.');
        setAlertType('danger');
        return;
      }
  
      // Create user in Supabase auth
      const { user, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signupError) {
        console.error(signupError);
        setAlertMessage('Signup failed. Please try again later.');
        setAlertType('danger');
        return;
      }
  
      // Store additional user data in Users table
      const { data, error: usersError } = await supabase
        .from('users')
        .insert([{ email, password, firstName, lastName, role, location }])
        .single();
    
    // Set user role in local storage or cookie
      localStorage.setItem('userRole', role);
 
      setAlertMessage('Signup successful!');
      setAlertType('success');
      navigate('/signup');
    } catch (error) {
      console.error(error);
      setAlertMessage('Signup failed. Please try again later.');
      setAlertType('danger');
    }
  };
  

  return (
    <div className="container">
      <h2>Signup</h2>
      {alertMessage && (
        <div className={`alert alert-${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSignupSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            ref={emailRef}
            required
          />
        </div>
        {!isEmailVerified && (
          <>
            {!isEmailSent ? (
              <button type="button" className="btn btn-primary" onClick={handleSendOTP}>
                Send OTP
              </button>
            ) : (
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  ref={otpRef}
                  required
                />
                <button type="button" className="btn btn-primary" onClick={handleVerifyOTP}>
                  Verify OTP
                </button>
              </div>
            )}
          </>
        )}
        {isEmailVerified && (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                ref={firstNameRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                ref={lastNameRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                ref={passwordRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                ref={confirmPasswordRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-control"
                id="role"
                ref={roleRef}
                required
              >
                <option value="">Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                ref={location}
                required
              />
            </div>
            
          </>
        )}
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
