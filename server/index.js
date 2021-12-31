//ERROR CODES:
//1 - Firebase doc does not exist under id
//2 - Required Id param is missing

const getFirebaseApp = require("firebase/app");
const { getFirestore, getDoc, doc } = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyAKpJ94ci7CytwBZjeJTEK8176svyK4JZg",
    authDomain: "jobprofilepagepurple.firebaseapp.com",
    projectId: "jobprofilepagepurple",
    storageBucket: "jobprofilepagepurple.appspot.com",
    messagingSenderId: "518522832417",
    appId: "1:518522832417:web:c69aaf48bdbd46e8f70560",
    measurementId: "G-MBT08NEWSE"
};

const fbApp = getFirebaseApp.initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

// var profileData = {
//     uid: 'L0j7cZxVokkgLFkRRTtC',
//     profile_image_url: 'https://ozhershco.me/images/profilepic.jpeg',
//     title: 'Developer',
//     company: 'Purple',
//     about: 'This is some information about me. Pretty great right??',
//     phone: '0546912114'
// };

// const path = require('path');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();


// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/profile/", async (req, res) => {
    res.json({
        message: "Specific profile 'id' param is required!",
        code: 2
    });
});

//get profile data using user uid
app.get("/profile/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const userRef = doc(db, 'users/' + id);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists) {
            res.json({
                message: 'Profile document was does not exist under this id!',
                code: 1
            });
        } else {
            const profileData = docSnap.data();
            res.send(JSON.stringify(profileData));
        }
    } catch (error) {
        console.log(error)
    }
});

//update profile using id
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});