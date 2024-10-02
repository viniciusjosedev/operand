import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APP_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
};

const firebaseConfigTest = {
  ...firebaseConfig,
  databaseURL: process.env.TEST_DATABASE_URL,
};

const NODE_ENV = process.env.NODE_ENV;

const configApp = initializeApp(
  NODE_ENV === 'test' ? firebaseConfigTest : firebaseConfig,
);

export default configApp;
