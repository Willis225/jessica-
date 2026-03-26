import React, { useState, FormEvent } from 'react';
import { StockIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, password: string) => boolean;
  error: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (isLogin) {
      onLogin(email, password);
    } else {
      if (securityCode !== 'code123') {
        setLocalError('Invalid security code. Registration denied.');
        return;
      }
      onSignup(name, email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#050505] p-4 relative overflow-hidden">
      <div className="atmosphere" />
      <div className="spotlight-bg" />
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 transform rotate-12 hover:rotate-0 transition-transform duration-500">
            <StockIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center font-medium">
          {isLogin ? 'Sign in to manage your assets.' : 'Join to start your investment journey.'}
        </p>
        
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-blue-900/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Doe"
                    required={!isLogin}
                    className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="securityCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                    Security Code
                  </label>
                  <input
                    id="securityCode"
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    placeholder="Enter registration code"
                    required={!isLogin}
                    className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., your.email@example.com"
                required
                className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-blue-900/30 rounded-2xl px-5 py-4 pr-14 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {(error || localError) && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-medium">
                {error || localError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="text-center mt-8">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setLocalError('');
              }}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-2 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
