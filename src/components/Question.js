import React from 'react';

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

export default Question;