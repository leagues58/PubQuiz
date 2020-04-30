import firebase from '../Firebase';

const changeAnswerPoints = async (pointValue, answerId) => {
  firebase.firestore()
    .collection('answers')
    .doc(answerId)
    .update({points: pointValue ? Number(pointValue) : null});
};


export default changeAnswerPoints;