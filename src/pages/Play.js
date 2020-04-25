import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import firebase from '../Firebase';


const Play = () => {
  const {id} = useParams();
  const [teamData, setTeamData] = useState();

  useEffect(() => {
    const getTeamInfo = async () => {
      const doc = await firebase.firestore()
        .collection('teams')
        .doc(id)
        .get();

      if (doc) {
        setTeamData(doc.data())
      }
    };

    getTeamInfo();
  }, []);

  
  return (
    <div>
      <h3>Now playing the Pub Quiz!</h3>
      <h4>{id}</h4>
      <h4>Welcome team {teamData?.teamName}</h4>
      <h4>{JSON.stringify(teamData)}</h4>
    </div>
  );
};


export default Play;