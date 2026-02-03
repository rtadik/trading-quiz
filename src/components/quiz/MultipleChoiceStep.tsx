'use client';

import { motion } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface MultipleChoiceStepProps {
  question: string;
  options: Option[];
  value: string;
  onSubmit: (value: string) => void;
  stepNumber: number;
}

export default function MultipleChoiceStep({
  question,
  options,
  onSubmit,
  stepNumber,
}: MultipleChoiceStepProps) {
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
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onSubmit(option.value)}
            className="w-full text-left bg-white/5 border border-white/15 text-gray-200 px-6 py-4 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="group-hover:text-white transition-colors">
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
