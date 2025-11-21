import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUCCESS_COLOR } from '../../utils/constants';
import './SuccessMessage.css';

export const SuccessMessage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="success-message"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <svg
        className="success-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="11" stroke={SUCCESS_COLOR} strokeWidth="2" />
        <path
          d="M7 12L10 15L17 8"
          stroke={SUCCESS_COLOR}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{t.success.message}</span>
    </motion.div>
  );
};
