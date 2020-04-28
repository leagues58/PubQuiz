import firebase from '../Firebase';

const changeAnswerPoints = async (pointValue, teamId, questionId) => {
  const answers = await firebase.firestore().collection('questions')
    .doc(questionId)
    .get()
    

  const data = answers.data();

  data.answers.forEach((answer, index) => {
    if (answer.teamId === teamId) {
      data.answers[index].points = pointValue;
    }
  });

  await firebase.firestore().collection('questions').doc(questionId).update({answers: data.answers});
}


export default changeAnswerPoints;