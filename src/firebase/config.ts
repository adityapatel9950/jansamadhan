import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import configData from '../../firebase-applet-config.json';

// Initialize Firebase App
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(configData);

// Initialize Firestore with configured database ID
export const db: Firestore = getFirestore(app, configData.firestoreDatabaseId);

// Initialize Auth
export const auth: Auth = getAuth(app);

export default app;
