
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Rocket, UserCircle, Wifi, WifiOff, Database } from 'lucide-react';
import SparkleCursor from './SparkleCursor';
import { db } from '../services/mockDb';
import AdSpace from './AdSpace';
import { checkSupabaseConnection } from '../services/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const location = useLocation();
  const navigate = useNavigate();

  // Simple check for auth state update
  const [user, setUser] = useState(db.getCurrentUser());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen for storage changes to update UI if user logs in/out in another tab or component
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(db.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event dispatch for same-window updates
    window.addEventListener('user-auth-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-auth-change', handleStorageChange);
    };
  }, []);

  // Check Supabase Status
  useEffect(() => {
    const checkStatus = async () => {
        const isConnected = await checkSupabaseConnection();
        setServerStatus(isConnected ? 'connected' : 'disconnected');
    };
    checkStatus();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleListYourSpace = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Spaces', path: '/spaces' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-corporate-200 selection:text-corporate-900">
      <SparkleCursor />
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
             <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
                <div className="p-2 bg-corporate-600 rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-corporate-500/30">
                   <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white tracking-tight">
                  Nearby<span className="text-corporate-600">Space</span>
                </span>
             </Link>

             {/* Server Status Indicator in Header */}
             <div className="hidden lg:flex items-center space-x-2 text-xs bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-800" title="Database Status">
                <Database size={12} className="text-gray-400" />
                {serverStatus === 'checking' && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>}
                {serverStatus === 'connected' && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span>}
                {serverStatus === 'disconnected' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
             </div>
          </div>

          <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
            {/* List Your Space Button */}
            <button
              onClick={handleListYourSpace}
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-corporate-600 hover:bg-corporate-700 rounded-lg transition-colors shadow-lg shadow-corporate-500/30"
            >
              {user ? (
                <>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Dashboard
                </>
              ) : (
                'List Your Space'
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`block py-2 px-3 rounded md:p-0 transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-corporate-600 dark:text-corporate-400 font-bold'
                        : 'text-gray-900 hover:text-corporate-600 dark:text-white dark:hover:text-corporate-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="md:hidden mt-2">
                 <button
                    onClick={handleListYourSpace}
                    className="w-full text-left py-2 px-3 text-corporate-600 dark:text-corporate-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {user ? 'My Dashboard' : 'List Your Space'}
                  </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow pt-20 flex flex-col items-center">
        {/* Page Content */}
        <main className="w-full">
           {children}
        </main>

        {/* Bottom Horizontal Ad */}
        <div className="w-full max-w-7xl px-4 mt-8">
           <AdSpace type="horizontal" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center space-x-2">
                 <Rocket className="w-6 h-6 text-corporate-500" />
                 <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">NearbySpace</span>
              </Link>
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-sm">
                India's premium space rental platform. Connecting professionals with extraordinary spaces.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                  <li><Link to="/about" className="hover:text-corporate-500 transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-corporate-500 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                  <li><Link to="/privacy" className="hover:text-corporate-500 transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-corporate-500 transition-colors">Terms &amp; Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()} NearbySpace.App. All Rights Reserved.
            </span>
            <div className="flex items-center mt-4 sm:justify-center sm:mt-0 space-x-5">
               <span className="text-sm text-gray-500 dark:text-gray-400">
                 Brought to life by <span className="font-signature text-2xl text-corporate-600 dark:text-corporate-400 ml-1">Gowri</span>
               </span>
               <span className="text-2xl cursor-pointer hover:scale-125 transition-transform duration-200" role="img" aria-label="rocket">🚀</span>
               <span className="text-2xl cursor-pointer hover:scale-125 transition-transform duration-200" role="img" aria-label="sparkles">✨</span>
               <span className="text-2xl cursor-pointer hover:scale-125 transition-transform duration-200" role="img" aria-label="world">🇮🇳</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
