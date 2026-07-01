import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// public config — security is enforced by Firestore rules, not by hiding this
const firebaseConfig = {
  apiKey: 'AIzaSyBsZwtz1VUqjvjJZMRLHkLeWyD4nPyr9NY',
  authDomain: 'gabrielharlan-site.firebaseapp.com',
  projectId: 'gabrielharlan-site',
  storageBucket: 'gabrielharlan-site.firebasestorage.app',
  messagingSenderId: '54763532513',
  appId: '1:54763532513:web:b123faa1afdfc0faba47a0',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
