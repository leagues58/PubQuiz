import React from 'react';

const ScoreCard = ({questions, answers}) => {
  let score = 0;
  answers.forEach(answer => {
    if (answer.points) {
      score += answer.points;
    }
  });
  return (
    <div>
      <h3>Score Card ({score} pts)</h3>
      <ol>
      {questions.map((question) => {
        const answer = answers.find(a => a.questionId === question.id);
        return (
          <li style={{padding: '10px'}}>{answer?.answer} {answer?.points ? `: ${answer.points} points` : ``}<hr/></li>
        );
      })}
      </ol>
    </div>
  );
}


export default ScoreCard;