import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APP_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.FIREBASE_APP_KEY,
};

const configApp = initializeApp(firebaseConfig);

export default configApp;
