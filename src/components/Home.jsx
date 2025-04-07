import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './Header';

function Home() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
    }

    // Check for roomId in query parameters
    const params = new URLSearchParams(location.search);
    const roomIdParam = params.get('roomId');
    if (roomIdParam) {
      setRoomId(roomIdParam);
    }

    // Check if we already have a valid token
    const token = localStorage.getItem('authToken');
    if (token) {
      setHasToken(true);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation logic - only require password if no token exists
    if (!name || !roomId || (!hasToken && !password)) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      let token = localStorage.getItem('authToken');

      // Only call auth endpoint if we don't have a token
      if (!hasToken) {
        // Call to backend to validate password and generate token
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid password');
        }

        token = data.token;
        localStorage.setItem('authToken', token);
        setHasToken(true);
      }

      // Store user information
      localStorage.setItem('userName', name);

      // Navigate to room
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Failed to authenticate. Please check your password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <Header isLoginPage={true} />

      <div className="container max-w-md bg-white p-6 rounded-lg shadow-md mt-14 sm:mt-16">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="roomId" className="block mb-2 font-medium">
              Room ID:
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          {!hasToken && (
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required={!hasToken}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join Room
          </button>
        </form>
        {hasToken && (
          <p className="mt-4 text-green-600 text-center">Using saved authentication token</p>
        )}
      </div>
    </div>
  );
}

export default Home;
