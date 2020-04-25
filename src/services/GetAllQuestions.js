import firebase from '../Firebase';

const getAllQuestions = async () => {
  const questions = [];
  const snapshot = await firebase.firestore()
    .collection('questions')
    .get();

  if (snapshot) {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      questions.push({id: doc.id, question: doc.data().question, isOpen: doc.data().open});
    });
  }

  return questions;
};

export default getAllQuestions;