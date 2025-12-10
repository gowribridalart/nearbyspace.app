
import React from 'react';
import { motion } from 'framer-motion';
import AdSpace from '../components/AdSpace';

const Terms: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <AdSpace type="horizontal" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms & Conditions</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p>
            Welcome to <strong>NearbySpace.App</strong>. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">1. Scope of Services</h3>
          <p>
            NearbySpace.App is an online platform that connects owners of commercial and creative spaces ("Owners") with individuals seeking to rent such spaces ("Renters"). We act solely as an intermediary and are not a party to any rental agreement entered into between Owners and Renters.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">2. User Accounts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To access certain features, you must register for an account. You agree to provide accurate, current, and complete information.</li>
            <li>You are responsible for safeguarding your password and for all activities that occur under your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">3. Listings and Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Accuracy:</strong> Owners are solely responsible for the accuracy of their listings, including location, price, amenities, and availability.</li>
            <li><strong>Rights:</strong> By listing a space, you grant us a non-exclusive license to display your content (photos, descriptions) on our platform for marketing purposes.</li>
            <li><strong>Prohibited Content:</strong> You may not list spaces involved in illegal activities or upload content that is offensive, discriminatory, or violates third-party rights.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">4. Booking and Payments</h3>
          <p>
            NearbySpace.App facilitates the connection but does not currently process payments directly. All financial transactions, rental agreements, and deposits are handled directly between the Owner and the Renter. We are not liable for any payment disputes, refunds, or damages arising from a booking.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">5. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by applicable law, NearbySpace.App shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the service; (b) any conduct or content of any third party on the service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">6. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, India.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">7. Changes to Terms</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
