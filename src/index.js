import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

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

// collection ref
const collectionRef = collection(db, "books");

// get collection data
getDocs(collectionRef)
  .then((snapshot) => {
    const books = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(books);
  })
  .catch(console.log);

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(collectionRef, { title: addBookForm.title.value, author: addBookForm.author.value }).then(() => addBookForm.reset());
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => deleteBookForm.reset());
});
