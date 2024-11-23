import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium">{language.toUpperCase()}</span>
    </motion.button>
  );
} 