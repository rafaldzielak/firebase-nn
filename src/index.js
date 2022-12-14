import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDE0eYMJ_eEOOGZfoSRoPiIl79jPIEQ_AM",
  authDomain: "fir-9-tutorial-49b3c.firebaseapp.com",
  projectId: "fir-9-tutorial-49b3c",
  storageBucket: "fir-9-tutorial-49b3c.appspot.com",
  messagingSenderId: "497237359078",
  appId: "1:497237359078:web:069c001caa2138c887be27",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const collectionRef = collection(db, "books");

// queries
const q = query(collectionRef, orderBy("createdAt"));

// real time collection data
const unSubCol = onSnapshot(q, (snapshot) => {
  const books = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(collectionRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => addBookForm.reset());
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => deleteBookForm.reset());
});

// Get a single document
const docRef = doc(db, "books", "6nO9aHgXnUXphJfVwvrB");

// getDoc(docRef).then((doc) => console.log(doc.data(), doc.id));

const unSubDoc = onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

const updateForm = document.querySelector(".update");

updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", updateForm.id.value);
  updateDoc(docRef, {
    title: "UPDATED",
  }).then(() => deleteBookForm.reset());
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User created: ", cred.user);
      signupForm.reset();
    })
    .catch((err) => console.log(err.message));
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => console.log("User signed out"))
    .catch((err) => console.log(err.message));
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => console.log("User signed in: ", cred.user))
    .catch((err) => console.log(err.message));
});

// Subscription to Auth changes
const unSubAuth = onAuthStateChanged(auth, (user) => {
  console.log("Authentication changed, user: ", user);
});

// Unsubscribe from subscription:
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("Unsubscribing...");
  unSubAuth();
  unSubCol();
  unSubDoc();
});
