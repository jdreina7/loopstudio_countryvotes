import { useLanguage } from '../contexts/LanguageContext';
import './ErrorMessage.css';

export const ErrorMessage = () => {
  const { t } = useLanguage();

  return (
    <div className="error-message">
      <svg
        className="error-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="11" stroke="#dc3545" strokeWidth="2" />
        <path
          d="M8 8L16 16M16 8L8 16"
          stroke="#dc3545"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>{t.error.message}</span>
    </div>
  );
};
