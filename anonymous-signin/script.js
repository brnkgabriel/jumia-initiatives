const config = {
  apiKey: "AIzaSyC8htXCQ-5Tm_qCKgbVBQaS_Enu5zQmIeU",
  authDomain: "jumia-vote-deals.firebaseapp.com",
  projectId: "jumia-vote-deals",
  storageBucket: "jumia-vote-deals.appspot.com",
  messagingSenderId: "15013363201",
  appId: "1:15013363201:web:d8ed9ec2a4f2f331d50a00",
  measurementId: "G-GNT4HGW9Z3",
};

const app = firebase.initializeApp(config);
const firestore = app.firestore();
const auth = app.auth();

const email = user.email
const password = btoa(user.password)

const signUp = () => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => console.log("created"))
    .catch((err) => console.log(err));
};

const signIn = () => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => console.log("signed"))
    .catch((err) => {
      if (err.code === "auth/user-not-found") signUp();
    });
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    setDoc("users", "data", { hey: "Lanre" })
      .then((data) => console.log("doc set, with auth"))
      .catch((err) => console.log(err));
  } else {
    signIn();
  }
  console.log("user is", user);
});

const getDoc = (collection, docRef) => {
  return firestore
    .collection(collection)
    .doc(docRef)
    .get()
    .then((doc) => doc.data())
    .catch((err) => console.error(err));
};

const setDoc = (collection, docRef, data) => {
  const ref = firestore.collection(collection).doc(docRef);
  return ref.set(data, { merge: true });
};

// getDoc("marketing-initiatives", "data")
// .then(data => console.log("doc data is", data))
