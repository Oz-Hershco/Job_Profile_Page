import React, { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from './Firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { update } from './Redux/profile/profileSlice';
import { Page, Frame, TopBar, Avatar } from '@shopify/polaris';

import './App.css';
import ProfileForm from './Components/ProfileForm/ProfileForm';



function App() {


  const profile = useSelector((state) => state.profile.value);
  const dispatch = useDispatch();

  useEffect(() => {


    signInAnonymously(auth)
      .then(() => {
        // Signed in..
      })
      .catch((error) => {
        // ...
      });

    onAuthStateChanged(auth, (user) => {
      if (user) {

        const uid = user.uid;

        fetch(`/profile/${uid}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.code === 2) {
              console.error("Error: (" + data.code + ") " + data.message);
              return;
            }
            dispatch(update(data));
          }).catch(() => {

            dispatch(update({
              uid: uid,
              profile_image_url: '',
              title: '',
              company: '',
              about: '',
              phone: '',
              areacode: '+972'
            }));

          })
        // ...
      } else {
        // User is signed out
        // ...
      }
    });


  }, []);

  return (
    <div className="App">
      {
        profile ? (
          <Page narrowWidth>
            <ProfileForm />
            <Frame className="test" topBar={
              <TopBar userMenu={<Avatar source={profile.profile_image_url} />} />
            } />
          </Page>
        ) : null
      }

    </div>
  );
}

export default App;
