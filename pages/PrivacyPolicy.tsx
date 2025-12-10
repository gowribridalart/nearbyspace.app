
import React from 'react';
import { motion } from 'framer-motion';
import AdSpace from '../components/AdSpace';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p>
            At <strong>NearbySpace.App</strong> ("we," "our," or "us"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our space rental platform.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">1. Information We Collect</h3>
          <p>We collect information that you provide directly to us when you register, list a space, or make an enquiry.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Identification:</strong> Name, email address, phone number, and profile photographs.</li>
            <li><strong>Property Details:</strong> Addresses, property photos, amenities, and pricing information provided by owners.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including search queries, viewed listings, and device information (IP address, browser type).</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">2. How We Use Your Information</h3>
          <p>We use the collected data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Delivery:</strong> To facilitate connections between property owners and potential renters.</li>
            <li><strong>Communication:</strong> To send you updates regarding your listings, enquiries, or account status via email or WhatsApp (where applicable).</li>
            <li><strong>Verification:</strong> To verify the identity of users and the authenticity of property listings to maintain a trusted environment.</li>
            <li><strong>Improvement:</strong> To analyze user behavior and improve our website functionality and user experience.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">3. Sharing of Information</h3>
          <p>We do not sell your personal data. However, we may share information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Between Users:</strong> When a renter enquires about a space, relevant contact details are shared with the property owner to facilitate the transaction.</li>
            <li><strong>Service Providers:</strong> We may employ third-party companies to facilitate our service (e.g., cloud hosting, analytics), who have access to data only to perform these tasks on our behalf.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">4. Data Security</h3>
          <p>
            We implement industry-standard security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">5. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of any incorrect or incomplete data.</li>
            <li>Request deletion of your account and personal data (Subject to retention required by law).</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">6. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> privacy@nearbyspace.app<br />
            <strong>Address:</strong> NearbySpace Tech Pvt Ltd, Bangalore, India.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
