import { auth, db }
from "./firebase.js";

import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let allUsers = [];

onAuthStateChanged(auth, async (user)=>{

    if(!user){

        window.location.href =
        "signup.html";

        return;
    }

    document.getElementById("userEmail")
    .innerText = user.email;
    await setDoc(
    doc(
        db,
        "users",
        user.uid
    ),
    {
        email:user.email,
        online:true,
        lastSeen:Date.now()
    },
    { merge:true }
);

});

const messagesRef =
collection(db,"messages");

const usersRef =
collection(db,"users");

const typingRef =
doc(db,"typing","status");

document.getElementById("sendBtn")
.addEventListener("click",async()=>{

    const input =
    document.getElementById("messageInput");

    const text =
    input.value.trim();

    if(!text) return;

    await addDoc(
        messagesRef,
        {
            email: auth.currentUser.email,
            text: text,
            createdAt:
            new Date().toISOString()
        }
    );

    await setDoc(
        typingRef,
        {
            user:""
        }
    );

    input.value = "";

});

document
.getElementById("messageInput")
.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        document
        .getElementById("sendBtn")
        .click();

    }

});

document
.getElementById("messageInput")
.addEventListener("input",async()=>{

    await setDoc(
        typingRef,
        {
            user:
            auth.currentUser.email
        }
    );

});

const q =
query(
    messagesRef,
    orderBy("createdAt")
);

onSnapshot(q,(snapshot)=>{

    const messages =
    document.getElementById("messages");

    messages.innerHTML = "";

    document.getElementById(
        "messageCount"
    ).innerText =
    `Messages: ${snapshot.size}`;

    snapshot.forEach((doc)=>{

        const data =
        doc.data();

        const mine =
        data.email ===
        auth.currentUser?.email;

        messages.innerHTML += `

        <div
        class="${
        mine
        ? "my-message"
        : "other-message"
        }"
        onclick="
        navigator.clipboard.writeText(
        '${data.text}'
        )
        ">

        <b>${data.email}</b><br>

        ${data.text}

        <br>

        <small>
        ${new Date(
        data.createdAt
        ).toLocaleTimeString()}
        </small>

        </div>

        `;

    });

    messages.scrollTop =
    messages.scrollHeight;

});

onSnapshot(usersRef,(snapshot)=>{

    allUsers = [];

    snapshot.forEach((doc)=>{

        allUsers.push(doc.data());

    });

    renderUsers(allUsers);

    document.getElementById(
        "onlineCount"
    ).innerText =
    `Online: ${
        allUsers.filter(
            user => user.online
        ).length
    }`;

});

function renderUsers(users){

    const usersList =
    document.getElementById("usersList");

    usersList.innerHTML = "";

    users.forEach((user)=>{

        if(user.online){

    usersList.innerHTML +=
    `
    <div>
        🟢 ${user.email}
    </div>
    `;

}else{

    const time =
    user.lastSeen
    ?
    new Date(
        user.lastSeen
    ).toLocaleTimeString()
    :
    "Unknown";

    usersList.innerHTML +=
    `
    <div>
        ⚪ ${user.email}
        <br>
        <small>
            Last seen ${time}
        </small>
    </div>
    `;

}

    });

}

document
.getElementById("searchUser")
.addEventListener("input",(e)=>{

    const text =
    e.target.value
    .toLowerCase();

    const filtered =
    allUsers.filter(user =>
        user.email
        .toLowerCase()
        .includes(text)
    );

    renderUsers(filtered);

});

onSnapshot(
typingRef,
(snapshot)=>{

    const data =
    snapshot.data();

    if(
        data &&
        data.user &&
        data.user !==
        auth.currentUser?.email
    ){

        document
        .getElementById("typingStatus")
        .innerText =
        `${data.user} is typing...`;

    }
    else{

        document
        .getElementById("typingStatus")
        .innerText = "";

    }

});
window.addEventListener(
    "beforeunload",
    async ()=>{

        if(auth.currentUser){

            await setDoc(
                doc(
                    db,
                    "users",
                    auth.currentUser.uid
                ),
                {
                    email:
                    auth.currentUser.email,
                    online:false,
                    lastSeen:Date.now()
                }
            );

        }

    }
);
document.getElementById("logoutBtn")
.addEventListener("click",async()=>{

    await setDoc(
        doc(
            db,
            "users",
            auth.currentUser.uid
        ),
        {
            email:
            auth.currentUser.email,
            online:false,
            lastSeen:
            Date.now()
        }
    );

    await signOut(auth);

    window.location.href =
    "signup.html";

});