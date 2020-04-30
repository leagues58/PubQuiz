import React, {useState, useEffect} from 'react';
import {TextField, Button} from '@material-ui/core';
import submitAnswer from '../services/SubmitAnswer';

const FinalQuestion = ({question, answers, teamId}) => {
  const [isWager, setIsWager] = useState(true);
  const [wager, setWager] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const [isFinalAnswer, setIsFinalAnswer] = useState(false);

  useEffect(() => {
    const questionWager = answers.find(a => a.isWager);
    const questionAnswer = answers.find(a => !a.isWager);

    if (questionWager) {
      setWager(questionWager.answer);
      setIsWager(false);
      setIsFinalAnswer(true);
    }
    if (questionAnswer) {
      setIsFinalAnswer(false);
      setFinalAnswer(questionAnswer.answer);
    }
  }, [answers]);

  const handleWagerChange = (event) => {
    setWager(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setFinalAnswer(event.target.value)
  };

  const handleWagerSubmit = () => {
    submitAnswer(wager, question.id, teamId, true);
    setIsWager(false);
    setIsFinalAnswer(true);
  };

  const handleFinalAnswerSubmit = () => {
    submitAnswer(finalAnswer, question.id, teamId, false);
    setIsFinalAnswer(false);
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <h3>Final Question</h3>
      Submit your wager:
      <div style={{display:'flex', flexDirection:'row', marginTop:'1%'}}>
        <TextField id="outlined-multiline-static"
            rows={4}
            variant="outlined"
            disabled={!isWager}
            onChange={handleWagerChange}
            value={wager} />
            
          <Button variant='contained' color='primary' onClick={handleWagerSubmit} disabled={!isWager} style={{marginLeft:'1vh'}}>submit your wager</Button>
      </div>
      {!isWager && <div style={{display:'flex', flexDirection:'row', marginTop:'1%'}}>
        <TextField id="outlined-multiline-static"
            rows={4}
            variant="outlined"
            disabled={!isFinalAnswer}
            onChange={handleAnswerChange}
            value={finalAnswer} />
            
          <Button variant='contained' color='primary' onClick={handleFinalAnswerSubmit} disabled={!isFinalAnswer} style={{marginLeft:'1vh'}}>submit answer</Button>
      </div>}
    </div>
  );
};



export default FinalQuestion;