import React, {useState, useEffect} from 'react';
import {Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper} from '@material-ui/core';
import firebase from '../../Firebase';
import {useHistory} from 'react-router-dom';
import registerTeam from '../../services/RegisterTeam';
import {validateRegistration, defaultValidationObject} from '../../utils/CheckForValidRegisterInput';


const LoginForm = () => {
  const [teamSelectOptions, setTeamSelectOptions] = useState([]);
  const [joinData, setJoinData] = useState({});
  const [registerData, setRegisterData] = useState({teamName: '', email: '', password: ''});
  const [registrationErrors, setRegistrationErrors] = useState(defaultValidationObject);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('teams')
    .onSnapshot((snapshot) => {
      let teams = [];
      snapshot.forEach((doc) => {
        teams.push({id: doc.id, teamName: doc.data().teamName, password: doc.data().password});
      });
      setTeamSelectOptions(teams);
    });

    return () => unsubscribe();
  }, []);

  const handleRegisterFormChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setRegisterData({...registerData, [name]: value});
  };

  const handleJoinFormChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setJoinData({...joinData, [name]: value});
  };

  const registerTeamHandler = async (event) => {
    event.preventDefault();
    
    const registerValidation = validateRegistration(registerData);
    
   if (!registerValidation.teamNameError && !registerValidation.emailError && !registerValidation.passwordError) {
      const teamId = await registerTeam({...registerData, number: teamSelectOptions.length + 1});
      history.push('/play/' + teamId);
    } else {
      setRegistrationErrors(registerValidation);
    }
  };

  const signUserInToTeam = (data) => {
    if (!data.selectedTeam || data.selectedTeam === '') {
      return false;
    }

    if (data.password != teamSelectOptions.find(t => t.id === data.selectedTeam).password) {
      return false;
    }

    return true;

  };

  const joinTeamHandler = () => {
    const signIn = signUserInToTeam(joinData)
    if (signIn) {
      history.push('/play/' + joinData.selectedTeam);
    } else {
      alert('Password is incorrect.');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', marginTop:'2vh', marginBottom:'25vh'}}>
        <Paper elevation={3} style={{padding: '30px', width:'65vmin', margin: '20px'}}>
          <form style={{display: 'flex', flexDirection: 'column', justifyContent:'space-around'}}>
            <div>to form a new team, enter a team name and email:</div>
            <TextField label='team name' name='teamName' onChange={handleRegisterFormChange} style={{marginTop: '2vw'}} error={registrationErrors.teamNameError} helperText={registrationErrors.teamNameHelperText} />
            <TextField label='email address' name='email' onChange={handleRegisterFormChange} style={{marginTop: '2vw'}} error={registrationErrors.emailError} helperText={registrationErrors.emailHelperText} />
            <TextField type="password" label='team password' name='password' onChange={handleRegisterFormChange} style={{marginTop: '2vw'}} error={registrationErrors.passwordError} helperText={registrationErrors.passwordHelperText} />
            <Button variant='contained' onClick={registerTeamHandler} style={{marginTop: '3vw'}} color='primary'>register a new team!</Button>
          </form>
        </Paper>
        {teamSelectOptions.length &&
        <Paper elevation={3} style={{padding: '30px', width:'65vmin', margin: '20px'}}>
          <form style={{display: 'flex', flexDirection: 'column', marginTop:'1vh', width:'100%'}}>
            <Typography>or, join an existing team:</Typography>
            <FormControl>
              <InputLabel>team</InputLabel>
              <Select name='selectedTeam' onChange={handleJoinFormChange}>
                {teamSelectOptions.map((team) => {
                  return (<MenuItem value={team.id} key={team.id}>{team.teamName}</MenuItem>);
                })}
              </Select>
              <TextField type="password" label='team password' name='password' onChange={handleJoinFormChange} style={{marginTop: '2vw'}} />
              <Button variant='contained' onClick={joinTeamHandler} style={{marginTop: '3vw'}} color='primary'>join your team!</Button>
            </FormControl>
          </form>
        </Paper>}
    </div>
  );
};

export default LoginForm;