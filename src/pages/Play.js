import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import getTeam from '../services/GetTeam';


const Play = () => {
  const {id} = useParams();
  const [teamData, setTeamData] = useState();

  useEffect(() => {
    const getTeamInfo = async () => {
      const doc = await getTeam(id);
      if (doc) {
        setTeamData(doc);
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