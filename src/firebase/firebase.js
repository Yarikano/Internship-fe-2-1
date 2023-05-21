import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
	apiKey: 'AIzaSyDfsrq7dBfbimwj_8OURGFbBKhVRfK34YY',
	authDomain: 'chat-quiz-website-4905b.firebaseapp.com',
	projectId: 'chat-quiz-website-4905b',
	storageBucket: 'chat-quiz-website-4905b.appspot.com',
	messagingSenderId: '937080538646',
	appId: '1:937080538646:web:636facff71795ea6c91737'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
