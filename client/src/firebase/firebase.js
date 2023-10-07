// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDauC5xywKpwLy_WBOj6aaIVr0tAa0z4Rs",
//   authDomain: "oa-virtoffice-project.firebaseapp.com",
//   projectId: "oa-virtoffice-project",
//   storageBucket: "oa-virtoffice-project.appspot.com",
//   messagingSenderId: "416890512159",
//   appId: "1:416890512159:web:59d7b08b2333270e6f062a",
//   measurementId: "G-JDJCEPS4YH"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBMbEqT9cbcO4WzSJTYDUPcB3CiXN6HmpA",
  authDomain: "oa-virtoffice-project-a622a.firebaseapp.com",
  projectId: "oa-virtoffice-project-a622a",
  storageBucket: "oa-virtoffice-project-a622a.appspot.com",
  messagingSenderId: "620756780765",
  appId: "1:620756780765:web:7fb469f1db545b35f27d34",
  measurementId: "G-SRRXZ4C9NH"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);
