import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { ERROR_COLOR } from '../../utils/constants';
import './ErrorMessage.css';

export const ErrorMessage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="error-message"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <svg
        className="error-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="11" stroke={ERROR_COLOR} strokeWidth="2" />
        <path
          d="M8 8L16 16M16 8L8 16"
          stroke={ERROR_COLOR}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>{t.error.message}</span>
    </motion.div>
  );
};
