import React, { useState, FormEvent } from 'react';
import { StockIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (email: string, password: string) => boolean;
  error: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <StockIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          {isLogin ? 'Sign in to manage your assets.' : 'Join to start your investment journey.'}
        </p>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., your.email@example.com"
                required
                className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 ml-1"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
        
        {isLogin && (
            <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <p><strong>Demo Account:</strong></p>
                <p>Email: <code className="font-mono">jessica.allen@example.com</code></p>
                <p>Password: <code className="font-mono">password</code></p>
            </div>
        )}

      </div>
    </div>
  );
};

export default LoginScreen;
