import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from './Redux/profile/profileSlice';
import { Page, Card, Layout, Frame, TopBar, Avatar } from '@shopify/polaris';

import './App.css';
import ProfileForm from './Components/ProfileForm/ProfileForm';



function App() {

  const profile = useSelector((state) => state.profile.value);
  const dispatch = useDispatch();

  useEffect(() => {
    //for testing only - remove before deployment
    const storageData = JSON.parse(localStorage.getItem("profile"))
    if (storageData) {
      dispatch(update(storageData));
    } else {
      fetch("/profile/iSrl7Oiz8U9mczAJgyNL")
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 2) {
            console.error("Error: (" + data.code + ") " + data.message);
            return;
          }
          dispatch(update(data));
          //localStorage.setItem("profile", JSON.stringify(data))
        })
    }


  }, []);

  const handleProfileSave = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    };
    fetch('/profile/update', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
  }
  console.log(profile);

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
