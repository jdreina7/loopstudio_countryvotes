import { useState, useMemo } from 'react';
import { z } from 'zod';
import { CountryAutocomplete } from '../CountryAutocomplete/CountryAutocomplete';
import { ErrorIcon } from '../ErrorIcon/ErrorIcon';
import { votesApi } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ERROR_DUPLICATE_VOTE_KEY } from '../../utils/constants';
import './VoteForm.css';

interface VoteFormProps {
  onSuccess: () => void;
  onError: () => void;
}

export const VoteForm = ({ onSuccess, onError }: VoteFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryName: '',
    countryCode: '',
    flag: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const voteSchema = useMemo(() => z.object({
    name: z.string().min(2, t.voteForm.validation.nameMin),
    email: z.string().email(t.voteForm.validation.emailInvalid),
    countryName: z.string().min(1, t.voteForm.validation.countryRequired),
    countryCode: z.string().min(3, t.voteForm.validation.countryCodeInvalid),
    flag: z.string().url(t.voteForm.validation.flagInvalid),
  }), [t]);

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = voteSchema.pick({ [field]: true } as Record<string, true>);
      fieldSchema.parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleCountryChange = (countryName: string, countryCode: string, flag: string) => {
    setFormData((prev) => ({ ...prev, countryName, countryCode, flag }));
    if (countryCode) {
      setErrors((prev) => ({ ...prev, countryName: '', countryCode: '', flag: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      voteSchema.parse(formData);
      setIsSubmitting(true);

      await votesApi.createVote({
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        countryName: formData.countryName,
        flag: formData.flag,
      });

      onSuccess();
      setFormData({ name: '', email: '', countryName: '', countryCode: '', flag: '' });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        // Check if it's a duplicate email error
        if (error.message.includes(ERROR_DUPLICATE_VOTE_KEY)) {
          onError();
          setFormData({ name: '', email: '', countryName: '', countryCode: '', flag: '' });
          setErrors({});
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.countryCode &&
    !errors.name &&
    !errors.email &&
    !errors.countryName;

  return (
    <div className="vote-form-container">
      <h2 className="vote-form-title">{t.voteForm.title}</h2>
      <form onSubmit={handleSubmit} className="vote-form">
        <div className="form-group">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder={t.voteForm.namePlaceholder}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              placeholder={t.voteForm.emailPlaceholder}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <ErrorIcon />}
          </div>
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <CountryAutocomplete
            value={formData.countryName}
            onChange={handleCountryChange}
            error={errors.countryName}
          />
          {errors.countryName && (
            <span className="error-message">{errors.countryName}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? t.voteForm.submitting : t.voteForm.submitButton}
        </button>
      </form>
    </div>
  );
};
