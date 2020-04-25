import React, {useState, useEffect} from 'react';
import {Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography} from '@material-ui/core';
import firebase from '../../Firebase';
import {useHistory} from 'react-router-dom';
import registerTeam from '../../services/RegisterTeam';


const LoginForm = () => {
  const [teamSelectOptions, setTeamSelectOptions] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [registerData, setRegisterData] = useState({teamName: '', email: ''});
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('teams')
    .onSnapshot((snapshot) => {
      let teams = [];
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        teams.push({id: doc.id, teamName: doc.data().teamName});
      });
      setTeamSelectOptions(teams);
    });

    return () => unsubscribe();
  }, []);

  const handleFormChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setRegisterData({...registerData, [name]: value});
  };

  const registerTeamHandler = (event) => {
    event.preventDefault();
    console.log('sending form data')
    // validate input here

    // add team
    registerTeam(registerData);

    // redirect to play page
    history.push('/play');
  };

  return (
    <div>
      <div className='register-form'>
        <p>to form a new team, enter a team name and email</p>
        <form onSubmit={registerTeamHandler}>
          <TextField label='team name' name='teamName' onChange={handleFormChange} />
            <TextField label='email address' name='email' onChange={handleFormChange}/>
            <input type="submit" value="Submit" />
        </form>
      </div>
      <div><Typography> - or - </Typography></div>
      <div className='join-form'>
        <Typography>join an existing team</Typography>
        <form>
          <FormControl>
            <InputLabel>team</InputLabel>
          <Select id='team-select' value={selectedTeam}>
            {teamSelectOptions.map((team) => {
              return (<MenuItem value={team.id} key={team.id}>{team.teamName}</MenuItem>);
            })}
          </Select>
          <Button variant='contained'>join your team!</Button>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;