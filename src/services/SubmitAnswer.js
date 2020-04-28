import firebase from '../Firebase';

const submitAnswer = async (answer, questionId, teamId) => {
  const answerObj = {answer, teamId}
  await firebase.firestore()
    .collection('questions')
    .doc(questionId)
    .update({
      answers: firebase.firestore.FieldValue.arrayUnion(answerObj)
    })
    .catch((err) => {
      console.warn('Error saving answer to db', err);
    });
};


export default submitAnswer;