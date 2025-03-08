import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { host } from '../constants/Constants';

const ChessLogin: React.FC = () => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
}>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const { username, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://${host}/login`, { username, password }, {withCredentials: true});
      
      ('Login successful!'); // Handle success (e.g., redirect)
      nav('/home');
      console.log(response);

    } catch (err: any) {
      setError(err.response.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome Back to the Chess Game</h2>
        {error && <p className={`${(error=="login successful")?'text-green-400':'text-red-400 '} text-sm text-center mb-4`}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account? 
          <a href="/signup" className="text-blue-400 hover:underline ml-1">Sign up</a>
        </p>
      </div>
      <div className="absolute top-0 right-0 p-8">
        <img src="/path/to/chess-theme-image.png" alt="Chess Theme" className="w-32 h-32" />
      </div>
    </div>
  );
};

export default ChessLogin;
