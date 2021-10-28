import React from "react";
import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   addDoc,
// } from "firebase/firestore/lite";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

let config = {
  apiKey: "AIzaSyDir-JGOJvHS6fsoUhqXw94HnIx7rVBSiQ",
  authDomain: "cloud-education-cb112.firebaseapp.com",
  projectId: "cloud-education-cb112",
  storageBucket: "cloud-education-cb112.appspot.com",
  messagingSenderId: "1771704143",
  appId: "1:1771704143:web:e7fbf8947f558a53c37f3a",
  measurementId: "G-WWEHYRNHPT",
};
const app = initializeApp(config);
const db = getFirestore(app);

class TestFireBase extends React.Component {
  constructor(props) {
    super(props);
    // const app = initializeApp(config);
    this.state = {};
  }

  componentDidMount() {
    this.getUserData();

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        console.log("test - start listen ", snapshot);
        const userListListen = snapshot.docs.map((doc) => doc.data());
        console.log("test - start userListListen ", userListListen);
      },
      (error) => {
        console.log("test - start listen error ", error);
      }
    );
  }
  getUserData = async () => {
    console.log("test - start list users ");
    const usersCol = collection(db, "users");
    console.log("test - start usersCol ", usersCol);
    const userSnapshot = await getDocs(usersCol);
    console.log("test - start userSnapshot ", userSnapshot);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    console.log("test - start userList ", userList);
    this.props.updateFirebaseState(userList);
  };

  test = async () => {
    console.log("test - start write ");
    const docRef = await addDoc(collection(db, "users"), {
      name: "test 8",
      id: 8,
      status: true,
    });
    console.log("Document written with ID: ", docRef.id);
  };

  render() {
    return (
      <div>
        alo
        <button onClick={this.test}>test FB</button>
      </div>
    );
  }
}

export default TestFireBase;
