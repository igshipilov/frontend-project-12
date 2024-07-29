import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../api/api';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Используем RTK Query хук, который работает с api.reducer
  const [login, { isLoading }] = useLoginMutation();

  // Используем селектор для получения данных из auth редюсера
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Вызываем мутацию login, которая использует api.reducer
      const userData = await login({
		username,
		password
	  })
	  .unwrap();
	  
      // Диспатчим action в auth редюсер
      dispatch(setCredentials(userData));
      navigate('/chat');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Форма входа */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {user && <div>Welcome, {user.name}!</div>}
    </form>
  );
};

export default Auth;