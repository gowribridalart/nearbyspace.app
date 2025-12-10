
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Chrome, Github, Mail } from 'lucide-react';

const OwnerAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    
    // Simple mock login by email match
    const user = db.login(formData.email);
    if (user) {
      window.dispatchEvent(new Event('user-auth-change'));
      navigate('/dashboard');
    } else {
      setError('User not found. Please register first.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.email) {
      setError('All fields are required');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobile: formData.mobile,
      email: formData.email,
      joinedAt: new Date().toISOString()
    };

    db.saveOwner(newUser);
    window.dispatchEvent(new Event('user-auth-change'));
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider: 'Google' | 'GitHub') => {
    // 1. Simulate consistent OAuth data so testing is repeatable
    const email = provider === 'Google' ? 'demo.google@example.com' : 'demo.github@example.com';
    const firstName = provider === 'Google' ? 'Google' : 'GitHub';
    const lastName = 'User';

    // 2. Check if user already exists in local DB
    const existingUser = db.login(email);

    if (existingUser) {
      // User exists -> Log them in
      window.dispatchEvent(new Event('user-auth-change'));
      navigate('/dashboard');
    } else {
      // User does not exist -> Register them automatically
      const newUser = {
        id: `social_${Date.now()}`,
        firstName: firstName,
        lastName: lastName,
        mobile: '', // Mobile might need to be updated by user later in a real app
        email: email,
        joinedAt: new Date().toISOString()
      };
      
      db.saveOwner(newUser);
      // Log them in immediately after saving
      window.dispatchEvent(new Event('user-auth-change'));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'List Your Space'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {isLogin ? 'Login to manage your listings' : 'Join thousands of property owners'}
            </p>
          </div>

          {/* Social Login Section */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-white"
            >
              <Chrome size={20} className="mr-3 text-red-500" />
              Continue with Google
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full flex items-center justify-center py-3 px-4 bg-[#24292e] text-white border border-transparent rounded-xl text-sm font-medium hover:bg-[#2f363d] transition-colors"
            >
              <Github size={20} className="mr-3" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-corporate-500 outline-none dark:text-white"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-corporate-500 outline-none dark:text-white"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-corporate-500 outline-none dark:text-white"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </>
            )}
            
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-corporate-500 outline-none dark:text-white"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-corporate-500 text-white font-bold rounded-xl hover:bg-corporate-600 transition-colors shadow-lg shadow-corporate-500/30 flex items-center justify-center"
            >
              <Mail size={18} className="mr-2" />
              {isLogin ? 'Login Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
            >
              {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OwnerAuth;
