'use client';

import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center max-w-xl mx-auto"
    >
      <div className="mb-6">
        <span className="text-7xl">📊</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Discover Your Trading Personality
      </h1>
      <p className="text-gray-300 text-lg mb-2">
        Why do you keep making the same trading mistakes?
      </p>
      <p className="text-gray-400 mb-8">
        Answer 7 quick questions and get a free personalized report revealing
        your trading personality type, your biggest blind spots, and a specific
        action plan to improve your results.
      </p>
      <div className="space-y-4">
        <button
          onClick={onStart}
          className="w-full sm:w-auto bg-gradient-to-r from-pink-dark to-pink-light text-white font-semibold text-lg px-8 py-4 rounded-xl hover:from-[#EE01BC] hover:to-[#FF6BE8] transition-all duration-200 shadow-lg shadow-pink-dark/30 hover:shadow-pink-dark/50 hover:scale-105"
        >
          Start the Quiz
        </button>
        <p className="text-sm text-gray-500">
          Takes less than 2 minutes &bull; 100% free
        </p>
      </div>
      <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Private & secure</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Free PDF report</span>
        </div>
      </div>
    </motion.div>
  );
}
