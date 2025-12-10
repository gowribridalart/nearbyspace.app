
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import AdSpace from '../components/AdSpace';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      // Basic validation simulation
      if (formState.name && formState.email.includes('@') && formState.message) {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-6">
      {/* Top Ad */}
      <div className="w-full max-w-7xl mb-12">
        <AdSpace type="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        
        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Let's Start a Conversation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Whether you're looking to list your premium property or find the perfect studio, our team is here to assist you 24/7.
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <MapPin className="text-corporate-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Headquarters</h3>
                <p className="text-gray-500 dark:text-gray-400">101 Innovation Dr, Suite 500<br/>San Francisco, CA 94105</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Phone className="text-corporate-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Phone</h3>
                <p className="text-gray-500 dark:text-gray-400">+1 (555) 012-3456</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Mail className="text-corporate-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-500 dark:text-gray-400">hello@nearbyspace.app</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden"
        >
          {/* Animated background gradient blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-corporate-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => setFormState({...formState, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:border-corporate-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-corporate-200 dark:focus:ring-corporate-900 transition-all outline-none dark:text-white"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={(e) => setFormState({...formState, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:border-corporate-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-corporate-200 dark:focus:ring-corporate-900 transition-all outline-none dark:text-white"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({...formState, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:border-corporate-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-corporate-200 dark:focus:ring-corporate-900 transition-all outline-none dark:text-white resize-none"
                placeholder="I'm interested in..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status !== 'idle'}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center ${
                status === 'success' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-corporate-900 dark:bg-white dark:text-corporate-900 hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {status === 'idle' && (
                <>Send Message <Send className="ml-2 w-4 h-4" /></>
              )}
              {status === 'submitting' && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {status === 'success' && (
                <>Sent Successfully <CheckCircle className="ml-2 w-5 h-5" /></>
              )}
              {status === 'error' && (
                <>Error - Try Again <AlertCircle className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
