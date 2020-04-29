import React, {useState, useEffect} from 'react';
import firebase from '../Firebase';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import TabPanel from '../components/TabPanel';
import QuestionList from '../components/QuestionList';
import GameSummary from '../components/GameSummary';


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


  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('teams')
    .onSnapshot((snapshot) => {
      const teams = [];
      snapshot.forEach((doc) => {
        teams.push({
          id: doc.id, 
          teamName: doc.data().teamName,
          email: doc.data().email
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
          points: doc.data().points
        });
      });
      setAnswers(answersArr);
    });
    return () => unsubscribeCallback();
  }, []);

  

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-start', padding: '20px', backgroundColor:'lightgray'}}>
      <AppBar position="static">
        <Tabs value={index} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Questions/Answers" {...a11yProps(0)} />
          <Tab label="Game Summary" {...a11yProps(1)} />
          <Tab label={`Teams (${teams.length}) `} {...a11yProps(2)} />
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
    </div>
  );
};


export default Cockpit;