import React, {useState, useEffect} from 'react';
import firebase from '../Firebase';
import {AppBar, Tabs, Tab, Button} from '@material-ui/core/';
import TabPanel from '../components/TabPanel';
import QuestionList from '../components/QuestionList';
import GameSummary from '../components/GameSummary';
import removeData from '../services/RemoveDataSet';
import toggleCanJoinGame from '../services/ToggleCanJoinGame';


const TeamList = ({teams}) => {
  return (
    <div>
      <ol>
        {teams.map((team) => {
          return (
            <li style={{padding:'10px'}}><b>{team.teamName}</b><br/><i>{team.email}</i></li>
          );
        })}
      </ol>
    </div>
  );
};

const Cockpit = () => {
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setTabIndex] = useState(0);
  const [gameOpen, setGameOpen] = useState(false);


  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('teams')
    .orderBy('number', 'asc')
    .onSnapshot((snapshot) => {
      const teams = [];
      snapshot.forEach((doc) => {
        teams.push({
          id: doc.id, 
          teamName: doc.data().teamName,
          email: doc.data().email,
          number: doc.data().number
        });
      });
      setTeams(teams);
    });

    return () => unsubscribeCallback();
  }, []);

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('questions')
    .onSnapshot((snapshot) => {
      const questionsArr = [];
      snapshot.forEach((doc) => {
        questionsArr.push({
          id: doc.id, 
          question: doc.data().question, 
          isOpen: doc.data().isOpen,
          isFinalQuestion: doc.data().isFinalQuestion,
          questionNumber: doc.data().questionNumber,
          wasAsked: doc.data().wasAsked
        });
      });
      setQuestions(questionsArr.sort((a, b) => (a.questionNumber > b.questionNumber) ? 1 : -1));
    });

    return () => unsubscribeCallback();
  }, []);

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('answers')
    .onSnapshot((snapshot) => {
      const answersArr = [];
      snapshot.forEach((doc) => {
        answersArr.push({
          id: doc.id, 
          questionId: doc.data().questionId,
          teamId: doc.data().teamId,
          answer: doc.data().answer,
          points: doc.data().points,
          isWager: doc.data().isWager
        });
      });
      setAnswers(answersArr);
    });
    return () => unsubscribeCallback();
  }, []);

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('settings')
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        setGameOpen(doc.data().canJoinGame);
      });
    });
    return () => unsubscribeCallback();
  }, []);

  

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleRemoveAnswers = (dataSetName) => {
    const confirm = window.confirm('Are you sure? This will remove all the ' + dataSetName + ' data.');
    if (confirm) {
      if (removeData(dataSetName)) {
        alert(`${dataSetName} removed.`);
      } else {
        alert(`Unable to delete ${dataSetName}.`);
      }
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-start', padding: '20px', backgroundColor:'lightgray'}}>
      <AppBar position="static">
        <Tabs value={index} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Questions/Answers" {...a11yProps(0)} />
          <Tab label="Game Summary" {...a11yProps(1)} />
          <Tab label={`Teams (${teams.length}) `} {...a11yProps(2)} />
          <Tab label='Settings' {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      <TabPanel value={index} index={0}>
        <QuestionList teams={teams} questions={questions} answers={answers} />
      </TabPanel>
      <TabPanel value={index} index={1}>
        <GameSummary teams={teams} questions={questions} answers={answers}/>
      </TabPanel>
      <TabPanel value={index} index={2}>
        <h1>Teams</h1>
        <TeamList teams={teams} />
      </TabPanel>
      <TabPanel value={index} index={3}>
        <h1>Settings</h1>
        <div style={{display: 'flex', flexDirection:'column'}}>
          <Button variant='contained' onClick={() => {toggleCanJoinGame(!gameOpen)}} style={{marginTop:'2vw'}} color='primary'>{gameOpen ? 'Close' : 'Open'} Login</Button>
          <hr/>
          <h2>---- Danger Zone ----</h2>
          <Button variant='contained' onClick={() => {handleRemoveAnswers('teams')}} style={{marginTop: '1vw'}} color='primary'>Clear Teams</Button>
          <Button variant='contained' onClick={() => handleRemoveAnswers('answers')} style={{marginTop: '2vw'}} color='primary'>Clear Answers</Button>
          <Button variant='contained' onClick={() => {handleRemoveAnswers('questions')}} style={{marginTop: '2vw'}} color='primary'>Clear Questions</Button>
        </div>
      </TabPanel>
    </div>
  );
};


export default Cockpit;