import React, { useState } from 'react';
import type { User } from '../types';
import { AuthView } from '../types';
import { LEHIGH_COLORS } from '../constants';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [authView, setAuthView] = useState<AuthView>(AuthView.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // NOTE: This uses localStorage for simplicity. A real application should use a secure backend service.
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((u: User) => u.email === email && u.password === password);
    if (user) {
      onAuthSuccess(user);
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // NOTE: This uses localStorage for simplicity.
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.some((u: User) => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }
    const newUser: User = { email, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    // Automatically log in after registration
    const userToLogin = { email, profile: undefined, recommendations: undefined };
    onAuthSuccess(userToLogin);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(`If an account exists for ${email}, password recovery instructions have been sent.`);
    // In a real app, this would trigger a backend service.
  };

  const renderForm = () => {
    switch (authView) {
      case AuthView.REGISTER:
        return (
          <form onSubmit={handleRegister} className="space-y-6">
            <h2 className="text-2xl font-bold text-center" style={{color: LEHIGH_COLORS.brown}}>Create Account</h2>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <button type="submit" className="w-full py-2 text-white rounded-md hover:opacity-90 transition-opacity" style={{backgroundColor: LEHIGH_COLORS.brown}}>Register</button>
            <p className="text-sm text-center">Already have an account? <button type="button" onClick={() => setAuthView(AuthView.LOGIN)} className="font-medium hover:underline" style={{color: LEHIGH_COLORS.lightBrown}}>Log In</button></p>
          </form>
        );
      case AuthView.FORGOT_PASSWORD:
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <h2 className="text-2xl font-bold text-center" style={{color: LEHIGH_COLORS.brown}}>Reset Password</h2>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <button type="submit" className="w-full py-2 text-white rounded-md hover:opacity-90 transition-opacity" style={{backgroundColor: LEHIGH_COLORS.brown}}>Send Reset Link</button>
            <p className="text-sm text-center"><button type="button" onClick={() => setAuthView(AuthView.LOGIN)} className="font-medium hover:underline" style={{color: LEHIGH_COLORS.lightBrown}}>Back to Login</button></p>
          </form>
        );
      case AuthView.LOGIN:
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-bold text-center" style={{color: LEHIGH_COLORS.brown}}>Welcome Back</h2>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <div>
              <label className="block text-sm font-medium" style={{color: LEHIGH_COLORS.darkGray}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800" />
            </div>
            <div className="flex items-center justify-between">
              <div/>
              <button type="button" onClick={() => setAuthView(AuthView.FORGOT_PASSWORD)} className="text-sm font-medium hover:underline" style={{color: LEHIGH_COLORS.lightBrown}}>Forgot password?</button>
            </div>
            <button type="submit" className="w-full py-2 text-white rounded-md hover:opacity-90 transition-opacity" style={{backgroundColor: LEHIGH_COLORS.brown}}>Log In</button>
            <p className="text-sm text-center">Don't have an account? <button type="button" onClick={() => setAuthView(AuthView.REGISTER)} className="font-medium hover:underline" style={{color: LEHIGH_COLORS.lightBrown}}>Sign Up</button></p>
          </form>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-2xl" style={{backgroundColor: LEHIGH_COLORS.offWhite}}>
        <h1 className="text-4xl font-bold text-center" style={{ color: LEHIGH_COLORS.brown }}>Lehigh Linc-Up</h1>
        {error && <p className="p-3 text-center text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.error}}>{error}</p>}
        {success && <p className="p-3 text-center text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.success}}>{success}</p>}
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;