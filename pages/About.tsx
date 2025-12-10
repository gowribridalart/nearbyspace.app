
import React from 'react';
import { motion } from 'framer-motion';
import { TEAM } from '../constants';
import AdSpace from '../components/AdSpace';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-950 flex flex-col items-center">
      {/* Top Ad */}
      <div className="w-full max-w-7xl px-6 pt-6">
        <AdSpace type="horizontal" />
      </div>

      {/* Mission Section */}
      <section className="py-24 px-6 border-b border-gray-100 dark:border-gray-900 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Redefining <span className="text-corporate-500">How You Work</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            At NearbySpace, we believe the environment shapes the outcome. Our mission is to democratize access to world-class professional spaces, bridging the gap between property owners and the visionaries who need room to grow. We don't just rent desks; we curate experiences that inspire success.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Spaces', value: '500+' },
            { label: 'Cities', value: '12' },
            { label: 'Happy Clients', value: '10k+' },
            { label: 'Avg Rating', value: '4.9' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring" }}
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm text-corporate-600 uppercase tracking-widest font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">The Minds Behind NearbySpace</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {TEAM.map((member, index) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm">{member.bio}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-corporate-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
