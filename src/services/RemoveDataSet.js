import firebase from '../Firebase';

const removeAllAnswers = async (dataSetName) => {
  const batch = firebase.firestore().batch();

  firebase.firestore()
    .collection(dataSetName)
    .get()
    .then(response => {
      response.docs.forEach(userDocRef => {
        batch.delete(userDocRef.ref)
      });

    batch.commit()
  })
  .then(() => {
    return true;
  })
  .catch(() => {
    return false;
  });
};



export default removeAllAnswers;