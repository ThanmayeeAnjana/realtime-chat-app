import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDt5YLfvCnrnkY8vcMXHA7nct3odiOL9B4",
  authDomain: "realtime-chat-app-1f2e5.firebaseapp.com",
  projectId: "realtime-chat-app-1f2e5",
  storageBucket: "realtime-chat-app-1f2e5.firebasestorage.app",
  messagingSenderId: "327945684737",
  appId: "1:327945684737:web:6dc7a1cf27aca335e3bd00"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);