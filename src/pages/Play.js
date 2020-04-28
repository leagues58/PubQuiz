import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import getTeam from '../services/GetTeam';
import firebase from '../Firebase';
import {TextField, Button, AppBar, Paper} from '@material-ui/core';
import submitAnswer from '../services/SubmitAnswer';

const Question = ({children}) => {
  
  if (children) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', marginTop: '2vh', width:'100%'}}>
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

const QuestionList = ({questions, teamId}) => {
  let score = 0;
  questions.forEach(question => {
    if (question.answers) {
      question.answers.forEach(answer => {
        if (answer.teamId === teamId) {
          score += answer.points ? Number(answer.points) : 0;
        }
      });
    }
  });
  return (
    <div>
      <h3>Score Card ({score} pts)</h3>
      <ol>
      {questions.map((question) => {
        if (question.answers) {
          const answer = question.answers?.find(a => a.teamId === teamId);
          return (
            <li style={{padding: '10px'}}><b>{question.question}</b><br/><i>{answer ? ` ${answer.answer} (${answer.points ? answer.points : '-'} pts)` : null}</i><hr/></li>
            
          );
        } else {
          return null;
        }

      })}
      </ol>
    </div>
  );
}


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
    .onSnapshot((snapshot) => {
      const questionsArr = [];
      snapshot.forEach((doc) => {
        questionsArr.push({
          id: doc.id, 
          question: doc.data().question, 
          isOpen: doc.data().open,
          answers: doc.data().answers,
          dateAdded: doc.data().dateAdded
        });
      });
      setQuestions(questionsArr.sort((a, b) => (a.dateAdded > b.dateAdded) ? 1 : -1));
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
          teamId: doc.data().teamId,
          questionId: doc.data().questionId,
          answer: doc.data().answer,
          dateAdded: doc.data().dateAdded
        });
      });
      setAnswers(answersArr);
    });

    return () => unsubscribeCallback();
  }, [teamData]);


  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding: '20px', backgroundColor:'lightgray', paddingBottom:'10%'}}>
      <AppBar position="static">
        <span style={{padding: '10px', fontSize:'1.2em', fontWeight: 'bold'}}>Stillwater Pub Quiz - {teamData?.teamName}</span>
      </AppBar>
      {JSON.stringify(answers)}
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <Question>{questions.find(q => q.isOpen)?.question}</Question>
        <AnswerArea question={questions.find(q => q.isOpen)} teamId={id}/>
      </Paper>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <QuestionList questions={questions} teamId={id} />
      </Paper>
    </div>
  );
};


export default Play;