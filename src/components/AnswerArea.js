import React, {useState, useEffect} from 'react';
import submitAnswer from '../services/SubmitAnswer';
import {TextField, Button} from '@material-ui/core';

const AnswerArea = ({question, teamId, answers}) => {
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
    let submittedAnswer = answers?.find(a => a.questionId === question?.id);
    if (submittedAnswer) {
      setAnswerSubmitted(true);
      if (question?.id !== currentQuestionId) {
        setAnswer(submittedAnswer.answer);
        setCurrentQuestionId(question?.id);
      }
    } else {
      setAnswerSubmitted(false);
    }

  }, [answers]);

  useEffect(() => {
    let submittedAnswer = answers?.find(a => a.questionId === question?.id);
    if (submittedAnswer) {
      setAnswer(submittedAnswer.answer);
    } else {
      setAnswer('');
    }
  }, [question])


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

export default AnswerArea;