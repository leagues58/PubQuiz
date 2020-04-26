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
  AppBar, Tabs, Tab
} from '@material-ui/core/';
import TabPanel from '../components/TabPanel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


const TeamList = ({teams}) => {
  return (
    <div>
      <h3>Team List</h3>
      <List component="nav" aria-label="main mailbox folders">
        {teams.map((team) => {
          return (
            <ListItem button key={team.teamId}>
              <ListItemText primary={team.teamName} secondary={team.email}  />
            </ListItem>
          );
        })}
      </List>
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

  return (
    <div>
      <div>
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
              <Typography className={classes.heading}>{index+1}. {question.question} {question.isOpen ? '(Open)' : '(Closed)'}</Typography>
            </ExpansionPanelSummary>
            {question.answers?.map((answer) => {
              return (
                <ExpansionPanelDetails key={answer.teamId + question.id}>
                  <Typography>{teams.find(t => t.id === answer.teamId).teamName}: {answer.answer}</Typography>
                  <TextField></TextField>
                </ExpansionPanelDetails>
              );
            })}
          </ExpansionPanel>
        );
      })}
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
          answers: doc.data().answers
        });
      });
      setQuestions(questions);
    });

    return () => unsubscribeCallback();
  }, []);

  

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={index} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Teams" {...a11yProps(0)} />
          <Tab label="Questions/Answers" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={index} index={0}>
        <h1>Cockpit</h1>
        <TeamList teams={teams}/>
      </TabPanel>
      <TabPanel value={index} index={1}>
        <h1>Cockpit</h1>
        <QuestionList teams={teams} questions={questions} />
      </TabPanel>
    </div>
  );
};


export default Cockpit;