  import firebase from 'firebase/app';
  import firebaseConfig from './FirebaseConfig';
  import 'firebase/firestore';
  import 'firebase/analytics';
  
  
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


  export default firebase;