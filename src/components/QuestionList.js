import React from 'react';
import addQuestion from '../services/AddQuestion';
import {Fab, Typography,
  ExpansionPanel, 
  ExpansionPanelSummary, 
  ExpansionPanelDetails, 
  TextField, Switch
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import changeQuestionState from '../services/ChangeQuestionState';
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


const QuestionList = ({teams, questions, answers}) => {
  const classes = useStyles();

  const addQuestionHandler = () => {
    addQuestion(`question#${questions.length+1}`, questions.length+1, false);
  };

  const handleOpenSwitchChange = (questionId, state) => {
    changeQuestionState(questionId, state);
  };

  const assignPoints = async (pointValue, answerId) => {
    await changeAnswerPoints(pointValue, answerId);
  };

  return (
    <div style={{display: 'flex', flexDirection:'column', width:'90vw'}}>
      <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h3>Question List </h3>
        <Fab color="primary" aria-label="add" onClick={addQuestionHandler}>
          <AddIcon />
        </Fab>
      </div>
      {questions.map((question) => {
        const questionAnswers = answers.filter(a => a.questionId === question.id);
        return (
          <ExpansionPanel key={question.id}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content" >
              <Typography className={classes.heading}> {question.questionNumber} ({questionAnswers.length} responses) </Typography>
              <Switch checked={question.isOpen} onChange={() => {handleOpenSwitchChange(question.id, !question.isOpen)}} name="checkedB" color="primary" /> 

            </ExpansionPanelSummary>
            {questionAnswers.map((answer) => {
              return (
                <ExpansionPanelDetails key={answer.teamId + question.id}>
                  <div><b>{teams.find(t => t.id === answer.teamId).teamName}:</b> <i>{answer.answer}</i></div>
                  <TextField value={answer.points} style={{width:'50px', marginLeft:'20px'}} onChange={(event) => assignPoints(event.target.value, answer.id)}></TextField> <div style={{color: answer.points ? 'green' : 'red'}}>pts</div>
                </ExpansionPanelDetails>
              );
            })}
          </ExpansionPanel>
        );
      })}
    </div>
  );
};


export default QuestionList;