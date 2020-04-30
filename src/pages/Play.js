import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import getTeam from '../services/GetTeam';
import firebase from '../Firebase';
import {AppBar, Paper} from '@material-ui/core';
import ScoreCard from '../components/ScoreCard';
import Question from '../components/Question';
import AnswerArea from '../components/AnswerArea';
import GameSummary from '../components/GameSummary';
import FinalQuestion from '../components/FinalQuestion';


const Play = () => {
  const {id} = useParams();
  const [teamData, setTeamData] = useState({});
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const getTeamInfo = async () => {
      const doc = await getTeam(id);
      if (doc) {
        setTeamData({...doc, id});
      } else {
        history.push('/');
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
    //.where('teamId', '==', id)
    .onSnapshot((snapshot) => {
      const answersArr = [];
      snapshot.forEach((doc) => {
        answersArr.push({
          id: doc.id, 
          questionId: doc.data().questionId,
          teamId: doc.data().teamId,
          answer: doc.data().answer,
          points: doc.data().points,
          isWager: doc.data().isWager 
        });
      });
      setAnswers(answersArr);
    });
    return () => unsubscribeCallback();
  }, []);

  useEffect(() => {
    const unsubscribeCallback = firebase.firestore()
    .collection('teams')
    .orderBy('number', 'asc')
    .onSnapshot((snapshot) => {
      const teams = [];
      snapshot.forEach((doc) => {
        teams.push({
          id: doc.id, 
          teamName: doc.data().teamName,
          email: doc.data().email,
          number: doc.data().number
        });
      });
      setTeams(teams);
    });

    return () => unsubscribeCallback();
  }, []);

  const openQuestion = questions.find(q => q.isOpen);
  let QuestionContent = <div></div>;

  if (openQuestion?.questionNumber === questions.length) {
    QuestionContent = (
      <div>
        <FinalQuestion question={openQuestion} answers={answers.filter(a => a.teamId === id && a.questionId === openQuestion.id)} teamId={id} />
      </div>
    );
  } else {
    QuestionContent = (
      <div>
        <Question number={openQuestion?.questionNumber}/>
        <AnswerArea question={openQuestion} teamId={id} answers={answers.filter(a => a.teamId === id)}/>
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding: '20px', backgroundColor:'lightgray', paddingBottom:'10%'}}>
      <AppBar position="static">
        <span style={{padding: '10px', fontSize:'1.2em', fontWeight: 'bold'}}>Stillwater Pub Quiz - {teamData?.teamName} (team #{teamData.number})</span>
      </AppBar>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        {QuestionContent}
      </Paper>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <ScoreCard questions={questions} answers={answers.filter(a => a.teamId === id)} />
      </Paper>
      <Paper elevation={3} style={{display:'flex', flexDirection:'column', padding: '10px', marginTop: '3vh', width:'90%'}}>
        <GameSummary teams={teams} questions={questions} answers={answers} />
      </Paper>
    </div>
  );
};


export default Play;