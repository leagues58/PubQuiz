import React, {useState, useEffect} from 'react';
import firebase from '../Firebase';
import addQuestion from '../services/AddQuestion';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel, 
  ExpansionPanelSummary, 
  ExpansionPanelDetails, 
  TextField,
  List, ListItem, ListItemText,
  AppBar, Tabs, Tab,
  Switch
} from '@material-ui/core/';
import TabPanel from '../components/TabPanel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import changeQuestionState from '../services/ChangeQuestionState';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import changeAnswerPoints from '../services/ChangeAnswerPoints';

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
    console.log('sorted totals: ' + JSON.stringify(sortedTotals))
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

const QuestionList = ({teams, questions}) => {
  const classes = useStyles();

  const addQuestionHandler = () => {
    const questionText = prompt('Add a question: ');
    if (questionText) {
      addQuestion(questionText);
    }
  };

  const handleOpenSwitchChange = (questionId, state) => {
    changeQuestionState(questionId, state);
  };

  const assignPoints = async (pointValue, teamId, questionId) => {
    await changeAnswerPoints(pointValue, teamId, questionId);
  };

  return (
    <div style={{display: 'flex', flexDirection:'column', width:'90vw'}}>
      <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h3>Question List </h3>
        <Fab color="primary" aria-label="add" onClick={addQuestionHandler}>
          <AddIcon />
        </Fab>
      </div>
      {questions.map((question, index) => {
        return (
          <ExpansionPanel key={question.id}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content" >
              <Typography className={classes.heading}>{index+1}. {question.question} {`(${question.answers.length} responses)`} </Typography>
              <Switch checked={question.isOpen} onChange={() => {handleOpenSwitchChange(question.id, !question.isOpen)}} name="checkedB" color="primary" /> 

            </ExpansionPanelSummary>
            {question.answers?.map((answer) => {
              return (
                <ExpansionPanelDetails key={answer.teamId + question.id}>
                  <div><b>{teams.find(t => t.id === answer.teamId).teamName}:</b> <i>{answer.answer}</i></div>
                  <TextField value={answer.points} style={{width:'50px', marginLeft:'20px'}} onChange={(event) => assignPoints(event.target.value, answer.teamId, question.id)}></TextField> <div style={{color: answer.points ? 'green' : 'red'}}>pts</div>
                </ExpansionPanelDetails>
              );
            })}
          </ExpansionPanel>
        );
      })}
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
      const questions = [];
      snapshot.forEach((doc) => {
        questions.push({
          id: doc.id, 
          question: doc.data().question, 
          isOpen: doc.data().open,
          answers: doc.data().answers,
          dateAdded: doc.data().dateAdded
        });
      });
      setQuestions(questions.sort((a, b) => (a.dateAdded > b.dateAdded) ? 1 : -1));
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
        <QuestionList teams={teams} questions={questions} />
      </TabPanel>
      <TabPanel value={index} index={1}>
        <GameSummary teams={teams} questions={questions}/>
      </TabPanel>
      <TabPanel value={index} index={2}>
        <h1>Teams</h1>
        <TeamList teams={teams} />
      </TabPanel>
    </div>
  );
};


export default Cockpit;