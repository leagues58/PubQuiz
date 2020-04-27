import React, {useState, useEffect} from 'react';
import {Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper} from '@material-ui/core';
import firebase from '../../Firebase';
import {useHistory} from 'react-router-dom';
import registerTeam from '../../services/RegisterTeam';
import {isValidEmail, isValidTeamName} from '../../utils/CheckForValidRegisterInput';


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

  const handleTeamSelect = (event) => {
    setSelectedTeam(event.target.value);
  };

  const registerTeamHandler = async (event) => {
    event.preventDefault();
    const {email, teamName} = registerData;
    if (isValidEmail(email) && isValidTeamName(teamName)) {
      const teamId = await registerTeam(registerData);
      history.push('/play/' + teamId);
    } else {
      alert('Do better with your team name & email!');
    }
  };

  const joinTeamHandler = () => {
    if (selectedTeam !== '') {
      history.push('/play/' + selectedTeam);
    } else {
      alert('You neede to choose a team to join first!');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', marginTop:'5vh'}}>
      <div className='register-form' >
        <Paper elevation={3} style={{padding: '20px', width:'80vw'}}>
        <p>to form a new team, enter a team name and email</p>
        <form style={{display: 'flex', flexDirection: 'column', justifyContent:'space-around', marginTop:'1vh'}}>
          <TextField label='team name' name='teamName' onChange={handleFormChange} style={{marginTop: '3vw'}} />
          <TextField label='email address' name='email' onChange={handleFormChange} style={{marginTop: '3vw'}} />
          <Button variant='contained' onClick={registerTeamHandler} style={{marginTop: '3vw'}} color='primary'>register a new team!</Button>
        </form>
        </Paper>
      </div>
      <div style={{marginTop:'3vh', marginBottom:'3vh'}}><Typography> - or - </Typography></div>
      <div className='join-form'>
        <Paper elevation={5} style={{padding: '20px', width:'80vw'}}>
        <Typography>join an existing team</Typography>
        <form style={{display: 'flex', flexDirection: 'column', justifyContent:'center', marginTop:'1vh'}}>
          <FormControl>
            <InputLabel>team</InputLabel>
          <Select id='team-select' value={selectedTeam} onChange={handleTeamSelect}>
            {teamSelectOptions.map((team) => {
              return (<MenuItem value={team.id} key={team.id}>{team.teamName}</MenuItem>);
            })}
          </Select>
          <Button variant='contained' onClick={joinTeamHandler} style={{marginTop: '3vw'}} color='primary'>join your team!</Button>
          </FormControl>
        </form>
        </Paper>
      </div>
    </div>
  );
};

export default LoginForm;