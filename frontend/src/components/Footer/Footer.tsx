import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          {currentYear} | {t.footer.author} Juan David Reina
        </p>
      </div>
    </footer>
  );
};
