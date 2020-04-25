import React, {useState, useEffect} from 'react';
import getAllQuestions from '../services/GetAllQuestions';


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
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getAllQuestions();
      if (data) {
        setQuestions(data);
      }
    };

    getQuestions();
  }, [])
  return (
    <div>
      <h3>Question List</h3>
      <ul>
        {questions.map((question) => {
          return (<li key={question.id}>{question.question} - {question.isOpen.toString()}</li>);

        })}
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