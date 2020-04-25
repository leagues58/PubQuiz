import React, {useState, useEffect} from 'react';


const TeamList = () => {
  return (
    <div>
      <h3>Team List</h3>
      <ul>
        <li>Team1</li>
      </ul>
    </div>
  );
};

const QuestionList = () => {
  return (
    <div>
      <h3>Question List</h3>
      <ul>
        <li>Question 1</li>
      </ul>
    </div>
  );
};

const Cockpit = () => {
  return (
    <div>
      <h1>Cockpit</h1>
      <TeamList />
      <QuestionList />
    </div>
  );
};


export default Cockpit;