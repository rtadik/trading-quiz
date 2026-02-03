'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailInputStepProps {
  question: string;
  placeholder?: string;
  value: string;
  onSubmit: (value: string) => void;
  stepNumber: number;
}

export default function EmailInputStep({
  question,
  placeholder,
  value: initialValue,
  onSubmit,
  stepNumber,
}: EmailInputStepProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!value.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!isValidEmail(value.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <motion.div
      key={`step-${stepNumber}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
        {question}
      </h2>
      <input
        type="email"
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus
        className="w-full bg-white/5 border border-white/20 text-white text-lg px-6 py-4 rounded-xl focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-gray-500"
      />
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
      <div className="mt-6 flex items-start gap-3">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 flex items-center gap-2"
        >
          Continue
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        We&apos;ll send your personalized report to this email. No spam, ever.
      </p>
    </motion.div>
  );
}
