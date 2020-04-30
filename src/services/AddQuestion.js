import firebase from '../Firebase';


const addQuestion = async (questionText, number) => {
  const ref = await firebase.firestore()
    .collection('questions')
    .add({
      question: 'questionText2',
      isOpen: false,
      wasAsked: false,
      questionNumber: number
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });
  return ref.id;
};

export default addQuestion;