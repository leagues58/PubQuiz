import firebase from '../Firebase';


const addQuestion = async (questionText) => {
  const ref = await firebase.firestore()
    .collection('questions')
    .add({
      dateAdded: Date.now(),
      question: questionText,
      open: false,
      answers: []
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });
  return ref.id;
};

export default addQuestion;