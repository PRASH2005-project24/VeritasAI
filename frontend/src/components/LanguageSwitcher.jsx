import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangData = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <span className="language-flag">
          {currentLanguage === 'en' ? '🇺🇸' : 
           currentLanguage === 'es' ? '🇪🇸' :
           currentLanguage === 'fr' ? '🇫🇷' : 
           currentLanguage === 'hi' ? '🇮🇳' : '🇺🇸'}
        </span>
        <span className="language-code">{currentLanguage.toUpperCase()}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <>
          <div className="language-backdrop" onClick={() => setIsOpen(false)} />
          <div className="language-dropdown">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className="language-flag">
                  {language.code === 'en' ? '🇺🇸' : 
                   language.code === 'es' ? '🇪🇸' :
                   language.code === 'fr' ? '🇫🇷' : 
                   language.code === 'hi' ? '🇮🇳' : '🇺🇸'}
                </span>
                <div className="language-info">
                  <span className="language-name">{language.name}</span>
                  <span className="language-native">{language.native}</span>
                </div>
                {currentLanguage === language.code && (
                  <span className="language-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;