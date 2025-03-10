// LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from './Store';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, user, clearErrors } = useAuthStore();

  useEffect(() => {
    // Clear errors when component mounts or unmounts
    clearErrors();
    return () => clearErrors();
  }, [clearErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const success = await login(email, password);

    if (success) {
      // Reset form after successful login
      setEmail('');
      setPassword('');
    }
  };

  // Redirect to PromptBox if user is logged in
  if (user) {
    return <Navigate to="/prompt" />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;