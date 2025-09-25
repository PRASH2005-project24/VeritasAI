import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation data
const translations = {
  en: {
    // Navigation
    home: 'Home',
    verify: 'Verify',
    institution: 'Institution',
    admin: 'Admin',
    agent: 'AI Agent',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',

    // Landing Page
    landingTitle: 'Trusted',
    landingSubtitle: 'Certificate',
    landingAction: 'Validation',
    landingDescription: 'Fight fake degrees with blockchain + AI technology. Secure, fast, and reliable certificate verification.',
    uploadCertificate: 'Upload Certificate',
    verifyNow: 'Verify Now',

    // Authentication
    welcomeBack: 'Welcome Back',
    signInAccount: 'Sign in to your account',
    createAccount: 'Create Account',
    joinToday: 'Join VeritasAI today',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    accountType: 'Account Type',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    createOne: 'Create one',

    // User Roles
    student: 'Student',
    studentDesc: 'Verify your certificates',
    institutionRole: 'Institution',
    institutionDesc: 'Upload and manage certificates',
    verifier: 'Verifier',
    verifierDesc: 'Verify certificates in bulk',
    administrator: 'Administrator',
    adminDesc: 'System administration',

    // Certificate Verification
    certificateVerification: 'Certificate Verification',
    uploadToVerify: 'Upload your certificate to verify its authenticity instantly',
    dragDropFile: 'Drag and drop your certificate here or click to browse',
    selectFile: 'Select File',
    verifyQR: 'Verify with QR Code',
    scanQR: 'Scan QR Code',
    instantResults: 'Instant Results',
    instantResultsDesc: 'Get verification results in seconds',
    tamperDetection: 'Tamper Detection',
    tamperDetectionDesc: 'Advanced algorithms detect any modifications',
    blockchainVerified: 'Blockchain Verified',
    blockchainVerifiedDesc: 'Certificates verified against blockchain records',

    // Institution Portal
    institutionPortal: 'Institution Portal',
    manageUploadCerts: 'Manage and upload certificates for your students',
    institutionName: 'Institution Name',
    issuerEmail: 'Issuer Email',
    generateQR: 'Generate QR Code',
    processing: 'Processing...',

    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    systemOverview: 'System Overview and Analytics',
    totalCertificates: 'Total Certificates',
    validCertificates: 'Valid Certificates',
    fraudAttempts: 'Fraud Attempts',
    recentUploads: 'Recent Uploads',
    verificationRate: 'Verification Rate',
    allCertificates: 'All Certificates',
    validCerts: 'Valid Certificates',
    invalidCerts: 'Invalid Certificates',
    viewDetails: 'View Details',

    // Bulk Verification
    bulkVerification: 'Bulk Verification',
    uploadCSV: 'Upload CSV File',
    processMultiple: 'Process multiple certificates at once',
    bulkResults: 'Bulk Results',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    upload: 'Upload',

    // Messages
    uploadSuccess: 'Certificate uploaded successfully!',
    verificationSuccess: 'Certificate verified successfully!',
    loginSuccess: 'Login successful!',
    registrationSuccess: 'Registration successful!',
    errorOccurred: 'An error occurred. Please try again.',
    noDataFound: 'No data found.',
    processingRequest: 'Processing your request...',

    // Languages
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    spanish: 'Español',
    french: 'Français'
  },

  hi: {
    // Navigation
    home: 'होम',
    verify: 'सत्यापन',
    institution: 'संस्थान',
    admin: 'व्यवस्थापक',
    agent: 'AI एजेंट',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',

    // Landing Page
    landingTitle: 'विश्वसनीय',
    landingSubtitle: 'प्रमाणपत्र',
    landingAction: 'सत्यापन',
    landingDescription: 'ब्लॉकचेन + AI तकनीक के साथ नकली डिग्री से लड़ें। सुरक्षित, तेज़ और विश्वसनीय प्रमाणपत्र सत्यापन।',
    uploadCertificate: 'प्रमाणपत्र अपलोड करें',
    verifyNow: 'अभी सत्यापित करें',

    // Authentication
    welcomeBack: 'वापस स्वागत है',
    signInAccount: 'अपने खाते में साइन इन करें',
    createAccount: 'खाता बनाएं',
    joinToday: 'आज ही VeritasAI में शामिल हों',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    accountType: 'खाता प्रकार',
    signIn: 'साइन इन',
    signingIn: 'साइन इन हो रहा है...',
    creatingAccount: 'खाता बनाया जा रहा है...',
    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    createOne: 'बनाएं',

    // User Roles
    student: 'छात्र',
    studentDesc: 'अपने प्रमाणपत्रों को सत्यापित करें',
    institutionRole: 'संस्थान',
    institutionDesc: 'प्रमाणपत्र अपलोड और प्रबंधित करें',
    verifier: 'सत्यापनकर्ता',
    verifierDesc: 'बल्क में प्रमाणपत्र सत्यापित करें',
    administrator: 'व्यवस्थापक',
    adminDesc: 'सिस्टम प्रशासन',

    // Certificate Verification
    certificateVerification: 'प्रमाणपत्र सत्यापन',
    uploadToVerify: 'अपने प्रमाणपत्र की प्रामाणिकता तुरंत सत्यापित करने के लिए अपलोड करें',
    dragDropFile: 'अपना प्रमाणपत्र यहाँ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    selectFile: 'फ़ाइल चुनें',
    verifyQR: 'QR कोड से सत्यापित करें',
    scanQR: 'QR कोड स्कैन करें',
    instantResults: 'तत्काल परिणाम',
    instantResultsDesc: 'सेकंडों में सत्यापन परिणाम प्राप्त करें',
    tamperDetection: 'छेड़छाड़ का पता लगाना',
    tamperDetectionDesc: 'उन्नत एल्गोरिदम किसी भी संशोधन का पता लगाते हैं',
    blockchainVerified: 'ब्लॉकचेन सत्यापित',
    blockchainVerifiedDesc: 'ब्लॉकचेन रिकॉर्ड के विरुद्ध सत्यापित प्रमाणपत्र',

    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    submit: 'जमा करें',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    download: 'डाउनलोड',
    upload: 'अपलोड',

    // Languages
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    spanish: 'Español',
    french: 'Français'
  },

  es: {
    // Navigation
    home: 'Inicio',
    verify: 'Verificar',
    institution: 'Institución',
    admin: 'Administrador',
    agent: 'Agente IA',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',

    // Landing Page
    landingTitle: 'Validación',
    landingSubtitle: 'de Certificados',
    landingAction: 'Confiable',
    landingDescription: 'Combata los títulos falsos con tecnología blockchain + IA. Verificación de certificados segura, rápida y confiable.',
    uploadCertificate: 'Subir Certificado',
    verifyNow: 'Verificar Ahora',

    // Authentication
    welcomeBack: 'Bienvenido de Nuevo',
    signInAccount: 'Inicia sesión en tu cuenta',
    createAccount: 'Crear Cuenta',
    joinToday: 'Únete a VeritasAI hoy',
    fullName: 'Nombre Completo',
    emailAddress: 'Dirección de Email',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    accountType: 'Tipo de Cuenta',
    signIn: 'Iniciar Sesión',
    signingIn: 'Iniciando Sesión...',
    creatingAccount: 'Creando Cuenta...',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    createOne: 'Crear una',

    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    close: 'Cerrar',
    submit: 'Enviar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    download: 'Descargar',
    upload: 'Subir',

    // Languages
    language: 'Idioma',
    english: 'English',
    hindi: 'हिंदी',
    spanish: 'Español',
    french: 'Français'
  },

  fr: {
    // Navigation
    home: 'Accueil',
    verify: 'Vérifier',
    institution: 'Institution',
    admin: 'Administrateur',
    agent: 'Agent IA',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',

    // Landing Page
    landingTitle: 'Validation',
    landingSubtitle: 'de Certificats',
    landingAction: 'Fiable',
    landingDescription: 'Combattez les faux diplômes avec la technologie blockchain + IA. Vérification de certificats sécurisée, rapide et fiable.',
    uploadCertificate: 'Télécharger Certificat',
    verifyNow: 'Vérifier Maintenant',

    // Authentication
    welcomeBack: 'Bon Retour',
    signInAccount: 'Connectez-vous à votre compte',
    createAccount: 'Créer un Compte',
    joinToday: 'Rejoignez VeritasAI aujourd\'hui',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    accountType: 'Type de Compte',
    signIn: 'Se Connecter',
    signingIn: 'Connexion...',
    creatingAccount: 'Création du Compte...',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: 'Vous n\'avez pas de compte?',
    createOne: 'En créer un',

    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    close: 'Fermer',
    submit: 'Soumettre',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    download: 'Télécharger',
    upload: 'Télécharger',

    // Languages
    language: 'Langue',
    english: 'English',
    hindi: 'हिंदी',
    spanish: 'Español',
    french: 'Français'
  }
};

// Create Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language from localStorage on app start
  useEffect(() => {
    const savedLanguage = localStorage.getItem('veritasai_language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Change language
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('veritasai_language', languageCode);
    }
  };

  // Get translation for a key
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Get available languages
  const availableLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' }
  ];

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages,
    translations: translations[currentLanguage]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;