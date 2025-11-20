import { useLanguage } from '../contexts/LanguageContext';
import './SuccessMessage.css';

export const SuccessMessage = () => {
  const { t } = useLanguage();

  return (
    <div className="success-message">
      <svg
        className="success-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="11" stroke="#28a745" strokeWidth="2" />
        <path
          d="M7 12L10 15L17 8"
          stroke="#28a745"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{t.success.message}</span>
    </div>
  );
};
