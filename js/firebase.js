var config = {
  apiKey: "AIzaSyBFIVALU1KJKRWpJsUoETaKYffYZzJyKa0",
  authDomain: "p5firebasetest-abd4f.firebaseapp.com",
  projectId: "p5firebasetest-abd4f",
  storageBucket: "p5firebasetest-abd4f.firebasestorage.app",
  messagingSenderId: "213640996935",
  appId: "1:213640996935:web:ff00daaf5d893f77102962"
  };
  
  firebase.initializeApp(config)
 
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  
/* import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCKXogedI2eY9vx_SuhrA2OP_VaLeHpe3s",
    authDomain: "photodiary-e8aec.firebaseapp.com",
    projectId: "photodiary-e8aec",
    storageBucket: "photodiary-e8aec.appspot.com",
    messagingSenderId: "279678695401",
    appId: "1:279678695401:web:010c70eb4afa9dffe03d78"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
export default db; */

/* import {initializeApp} from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"

const instance = {
  apiKey: "AIzaSyCKXogedI2eY9vx_SuhrA2OP_VaLeHpe3s",
    authDomain: "photodiary-e8aec.firebaseapp.com",
    projectId: "photodiary-e8aec",
    storageBucket: "photodiary-e8aec.appspot.com",
    messagingSenderId: "279678695401",
    appId: "1:279678695401:web:010c70eb4afa9dffe03d78"
};

export const app = initializeApp(instance); */