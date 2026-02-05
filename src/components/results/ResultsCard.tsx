'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonalityTypeInfo } from '@/lib/personality-types';

interface ResultsCardProps {
  typeInfo: PersonalityTypeInfo;
  name: string;
}

export default function ResultsCard({ typeInfo, name }: ResultsCardProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const pdfUrl = `${appUrl}/api/pdf/${typeInfo.type.replace(/_/g, '-')}?name=${encodeURIComponent(name)}`;
  const communityLink = process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#';

  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://info.bobe.app';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Countdown timer */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-sm font-medium">
            Redirecting to your dashboard in <span className="text-blue-400 font-bold text-lg">{countdown}</span> seconds...
          </p>
        </div>
      </motion.div>

      {/* Celebration header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="text-7xl mb-4"
        >
          {typeInfo.emoji}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          {name}, you&apos;re {typeInfo.name}!
        </motion.h1>
      </div>

      {/* Main result card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-gradient-to-br ${typeInfo.bgGradient} rounded-2xl p-8 mb-6 shadow-2xl`}
      >
        <p className="text-white/90 text-lg leading-relaxed">
          {typeInfo.shortDescription}
        </p>
      </motion.div>

      {/* PDF delivery notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">
              Your personalized report is on its way!
            </h3>
            <p className="text-gray-400 text-sm">
              Check your inbox for your detailed Trading Personality Report with specific strategies and an action plan.
            </p>
            <p className="text-yellow/80 text-sm mt-2 font-medium">
               Can't find it? Please check your Promotions or Spam folder.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow/10 border border-yellow/20 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <div>
            <h3 className="text-yellow font-semibold mb-1">
              Quick Tip for {typeInfo.name.replace('The ', '')}s
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {typeInfo.quickTip}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-pink-dark to-pink-light text-white font-semibold px-6 py-4 rounded-xl hover:from-[#EE01BC] hover:to-[#FF6BE8] transition-all duration-200 shadow-lg shadow-pink-dark/30"
        >
          Download Your Full Report (PDF)
        </a>
        <a
          href={communityLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-white/5 border border-white/20 text-white font-semibold px-6 py-4 rounded-xl hover:bg-white/10 transition-all duration-200"
        >
          Join Our Trading Community
        </a>
      </motion.div>
    </motion.div>
  );
}
