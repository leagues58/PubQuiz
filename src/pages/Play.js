import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import getTeam from '../services/GetTeam';
import firebase from '../Firebase';
import {TextField, Button} from '@material-ui/core';
import submitAnswer from '../services/SubmitAnswer';

const Question = ({children}) => {
  
  if (children) {
    return (
      <div>
        <h2>Question:</h2>
        {children}
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
  const answerSubmit = () => {
    if (answer === '') {
      const confirmEmpty = alert('Are you sure you want to submit an empty answer?');
      if (!confirmEmpty) {
        return false;
      }
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
  }, [question]);


  if (question) {
    return (
      <div>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          variant="outlined"
          onChange={answerChangeHandler}
          disabled={answerSubmitted}
        />
        <Button variant='contained' onClick={answerSubmit} disabled={answerSubmitted}>submit your answer</Button>
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


  return (
    <div>
      <h3>Now playing the Pub Quiz!</h3>
      <h4>{id}</h4>
      <h4>Welcome team {teamData?.teamName}</h4>
      <h4>{JSON.stringify(teamData)}</h4>
      <h4>{JSON.stringify(questions)}</h4>
      <Question>{questions.find(q => q.isOpen)?.question}</Question>
      <AnswerArea question={questions.find(q => q.isOpen)} teamId={id}/>
    </div>
  );
};


export default Play;