import { auth, db }
from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const email =
document.getElementById("email");

const password =
document.getElementById("password");

document.getElementById("signupBtn")
.addEventListener("click", async () => {

    try{

        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await setDoc(
            doc(
                db,
                "users",
                userCredential.user.uid
            ),
            {
                email:userCredential.user.email,
                online:true
            }
        );

        window.location.href =
        "chat.html";

    }
    catch(err){

        alert(err.message);

    }

});

document.getElementById("loginBtn")
.addEventListener("click", async () => {

    try{

        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await setDoc(
            doc(
                db,
                "users",
                userCredential.user.uid
            ),
            {
                email:userCredential.user.email,
                online:true
            }
        );

        window.location.href =
        "chat.html";

    }
    catch(err){

        alert(err.message);

    }

});