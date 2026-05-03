const _e = window.__env || {};
const FIREBASE_CONFIG = {
  apiKey:            _e.FIREBASE_API_KEY,
  authDomain:        _e.FIREBASE_AUTH_DOMAIN,
  databaseURL:       _e.FIREBASE_DATABASE_URL,
  projectId:         _e.FIREBASE_PROJECT_ID,
  storageBucket:     _e.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: _e.FIREBASE_MESSAGING_SENDER_ID,
  appId:             _e.FIREBASE_APP_ID
};

const EMAILJS_KEY      = _e.EMAILJS_PUBLIC_KEY  || '';
const EMAILJS_SERVICE  = _e.EMAILJS_SERVICE_ID  || '';
const EMAILJS_TEMPLATE = _e.EMAILJS_TEMPLATE_ID || '';
const NOTIFY_EMAIL     = _e.NOTIFY_EMAIL        || '';

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();
emailjs.init(EMAILJS_KEY);
