import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import getTeam from '../services/GetTeam';
import firebase from '../Firebase';
import {TextField, Button, AppBar, Paper} from '@material-ui/core';
import submitAnswer from '../services/SubmitAnswer';
import ScoreCard from '../components/ScoreCard';

const Question = ({number}) => {
  
  if (number) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', marginTop: '2vh', width:'100%'}}>
        <h2>Question #{number}</h2>
      </div>
    );
  } else {
    return (
      <div>
        <h2>No questions available</h2>
      </div>
    );
  }
};

const AnswerArea = ({question, teamId}) => {
  const [answer, setAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const answerSubmit = () => {
    if (answer === '') {
      alert('You gotta put something!');
      return false;
    }
    submitAnswer(answer, question.id, teamId);
  };

  const answerChangeHandler = (event) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    if (question?.answers?.filter(q => q.teamId === teamId).length > 0) {
      setAnswerSubmitted(true);
    } else {
      setAnswerSubmitted(false);
    }

    if (question?.id !== currentQuestionId) {
      setAnswer('');
      setCurrentQuestionId(question?.id);
    }
  }, [question]);


  if (question) {
    return (
      <div style={{display: 'flex',flexDirection:'column', marginTop:'2vh'}}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          variant="outlined"
          onChange={answerChangeHandler}
          disabled={answerSubmitted}
          value={answer}
        />
        <Button variant='contained' color='primary' onClick={answerSubmit} disabled={answerSubmitted} style={{marginTop:'1vh'}}>submit your answer</Button>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
};


const Play = () => {
  const {id} = useParams();
  const [teamData, setTeamData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const getTeamInfo = async () => {
      const doc = await getTeam(id);
      if (doc) {
        setTeamData(doc);
      }
    };

    getTeamInfo();
  }, []);

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('questions')
    .where('wasAsked', '==', true)
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
    .where('teamId', '==', id)
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

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding: '20px', backgroundColor:'lightgray', paddingBottom:'10%'}}>
      {JSON.stringify(questions)}
      <br/><br/>
      {JSON.stringify(answers)}
      <AppBar position="static">
        <span style={{padding: '10px', fontSize:'1.2em', fontWeight: 'bold'}}>Stillwater Pub Quiz - {teamData?.teamName}</span>
      </AppBar>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <Question number={questions.find(q => q.isOpen)?.questionNumber}/>
        <AnswerArea question={questions.find(q => q.isOpen)} teamId={id}/>
      </Paper>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <ScoreCard questions={questions} answers={answers} />
      </Paper>
    </div>
  );
};


export default Play;