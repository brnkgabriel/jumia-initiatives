const config = {
  apiKey: "AIzaSyC8htXCQ-5Tm_qCKgbVBQaS_Enu5zQmIeU",
  authDomain: "jumia-vote-deals.firebaseapp.com",
  projectId: "jumia-vote-deals",
  storageBucket: "jumia-vote-deals.appspot.com",
  messagingSenderId: "15013363201",
  appId: "1:15013363201:web:d8ed9ec2a4f2f331d50a00",
  measurementId: "G-GNT4HGW9Z3",
};


class Database {
  constructor(json) {
    this.initialize(json);
  }

  initialize(json) {
    this.json = json
    this.app = firebase.initializeApp(json.config);
    this.firestore = this.app.firestore();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("signed in with user object as", user);
      } else {
        this.signIn();
      }
      console.log("user from fb-auth is", user);
    });
    this.getDoc("marketing-initiatives", "data");
  }

  signIn() {
    console.log("this.json is", this.json)
    firebase.auth()
      .signInWithEmailAndPassword(this.json.email, this.json.password)
      .then((user) => console.log("signed"))
      .catch((err) => {
        if (err.code === "auth/user-not-found") this.signUp();
      });
  }

  signUp() {
    firebase.auth()
      .createUserWithEmailAndPassword(this.json.email, this.json.password)
      .then((user) => console.log("created"))
      .catch((err) => console.log(err));
  }

  getDoc(collection, docRef) {
    return this.firestore
      .collection(collection)
      .doc(docRef)
      .get()
      .then((doc) => {
        // pubsub.emit(util.DATA_ARRIVES, doc.exists ? doc.data() : {})
      })
      .catch((err) => console.error(err));
  }

  setDoc(collection, docRef, data) {
    const ref = this.firestore.collection(collection).doc(docRef);
    return ref.set(data, { merge: true });
  }
}

const email = user.email
const password = btoa(user.password)

const database = new Database({ config, email, password })

database.setDoc("users", "data", { user: "Gabriel" })
.then(doc => console.log("document"))
.catch(err => console.log(err))

// const app = firebase.initializeApp(config);
// const firestore = app.firestore();
// const auth = app.auth();

// const email = user.email
// const password = btoa(user.password)

// const signUp = () => {
//   auth
//     .createUserWithEmailAndPassword(email, password)
//     .then((user) => console.log("created"))
//     .catch((err) => console.log(err));
// };

// const signIn = () => {
//   auth
//     .signInWithEmailAndPassword(email, password)
//     .then((user) => console.log("signed"))
//     .catch((err) => {
//       if (err.code === "auth/user-not-found") signUp();
//     });
// };

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     setDoc("users", "data", { hey: "Lanre" })
//       .then((data) => console.log("doc set, with auth"))
//       .catch((err) => console.log(err));
//   } else {
//     signIn();
//   }
//   console.log("user is", user);
// });

// const getDoc = (collection, docRef) => {
//   return firestore
//     .collection(collection)
//     .doc(docRef)
//     .get()
//     .then((doc) => doc.data())
//     .catch((err) => console.error(err));
// };

// const setDoc = (collection, docRef, data) => {
//   const ref = firestore.collection(collection).doc(docRef);
//   return ref.set(data, { merge: true });
// };

// getDoc("marketing-initiatives", "data")
// .then(data => console.log("data from getDoc", data))
// .catch(err => console.log(error))

// setDoc("users", "data", { name: 2 })
// .then(data => console.log("data from setDoc", data))
// .catch(err => console.log(err))

// getDoc("marketing-initiatives", "data")
// .then(data => console.log("doc data is", data))
