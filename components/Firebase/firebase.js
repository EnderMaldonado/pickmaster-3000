import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB8P_0Oqwt41nMPPNuC-eafN4TokB5-Qn8",
  authDomain: "pickmaster-3000.firebaseapp.com",
  databaseURL: "https://pickmaster-3000.firebaseio.com",
  projectId: "pickmaster-3000",
  storageBucket: "pickmaster-3000.appspot.com",
  messagingSenderId: "326130267937",
  appId: "1:326130267937:web:8e2dd183cc04f1d4eff060",
  measurementId: "G-FCD8BMZ0LE"
}

if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig)
else
  firebase.app();

const dbRef = firebase.database().ref(`/${SHOP_ORIGIN.replace("myshopify.com","").replace(".","")}`)

export default dbRef

