import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCcGz8bYv01XEmF7PG2MoVmonOtwHbTec8",
  authDomain: "hw-lab-1847e.firebaseapp.com",
  databaseURL: "https://hw-lab-1847e.firebaseio.com",
  projectId: "hw-lab-1847e",
  storageBucket: "hw-lab-1847e.appspot.com",
  messagingSenderId: "42855344913"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();