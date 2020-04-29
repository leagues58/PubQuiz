import React, {useState, useEffect} from 'react';
import firebase from '../Firebase';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import TabPanel from '../components/TabPanel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import QuestionList from '../components/QuestionList';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


const GameSummary = ({teams, questions}) => {
  let teamTotals = [];
  const classes = useStyles();
  const teamIds = teams.map((team) => team.id);

  const getAnswers = (question) => {
    let result = [];
    
    teamIds.forEach((teamId, index) => {
      let points = question.answers?.find(a => a.teamId === teamId)?.points;
      if (points === undefined) {
        points = null;
      }
      result.push(points);
      let currentPoints = teamTotals[index] ? teamTotals[index] : 0;
      teamTotals[index] = currentPoints + Number(points);
    });

    return result;
  };

  useEffect(() => {
    let sortedTotals = teamTotals.sort((a, b) => (a < b) ? 1 : -1);
  }, [teamTotals]);


  return (
    <div style={{display: 'flex', flexDirection:'column', width:'90vw'}}>
      <h3>Team List</h3>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            {teams.map(team => {
              return (
                <TableCell align="right">{team.teamName}</TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question, index) => {
            const answerSet = getAnswers(question)
            return (
            <TableRow key={question.id}>
              <TableCell component="th" scope="row">
                {index+1}.
              </TableCell>
              {answerSet.map((cell, index) => {
                return (<TableCell align="right">{cell}</TableCell>);
              })}
            </TableRow>
            );
          })}
          <TableRow>
              <TableCell component="th" scope="row">
                <b>Total</b>
              </TableCell>
              {teamTotals.map(total => {
                return (
                  <TableCell align="right">{total}</TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


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
        {/*<GameSummary teams={teams} questions={questions}/>*/}
      </TabPanel>
      <TabPanel value={index} index={2}>
        <h1>Teams</h1>
        <TeamList teams={teams} />
      </TabPanel>
    </div>
  );
};


export default Cockpit;