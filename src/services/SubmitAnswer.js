import firebase from '../Firebase';

const submitAnswer = async (answer, questionId, teamId, isWager) => {
  const answerObj = {
    answer, 
    teamId, 
    questionId, 
    points: null, 
    dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
    isWager: isWager
  };

  console.log('answer' + JSON.stringify(answerObj))

  firebase.firestore()
    .collection('answers')
    .add(answerObj)
    .catch((err) => {
      console.warn('Error saving answer to db', err);
    });
};


export default submitAnswer;