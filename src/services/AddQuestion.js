import firebase from '../Firebase';


const addQuestion = async (questionText) => {
  const ref = await firebase.firestore()
  .collection('questions')
  .add({
    question: questionText,
    open: false
  })
  .catch((err) => {
    console.warn('Error saving new team to db', err);
  });
  return ref.id;
};

export default addQuestion;