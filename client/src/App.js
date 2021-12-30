import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from './Redux/profile/profileSlice';
import { Page, Card, Button } from '@shopify/polaris';

import './App.css';



function App() {

  const profile = useSelector((state) => state.profile.value);
  const dispatch = useDispatch();

  useEffect(() => {
    //for testing only - remove before deployment
    const storageData = JSON.parse(localStorage.getItem("profile"))
    if (storageData) {
      dispatch(update(storageData));
    } else {
      fetch("/profile")
        .then((res) => res.json())
        .then((data) => {
          dispatch(update(data));
          localStorage.setItem("profile", JSON.stringify(data))
        });
    }


  }, []);

  console.log(profile);

  return (
    <div className="App">
      {
        profile ? (
          <Page title="Example app">
            <Card sectioned>
              {profile.company}
              <Button onClick={() => alert('Button clicked!')}>Example button</Button>
            </Card>
          </Page>
        ) : null
      }

    </div>
  );
}

export default App;
