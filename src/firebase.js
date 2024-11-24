import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgNxyozZW_t94A",
  authDomain: "notekeeper-demo.firebaseapp.com",
  projectId: "notekeeper-demo",
  storageBucket: "notekeeper-demo.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c441975dc0f7d90f35c3e2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);