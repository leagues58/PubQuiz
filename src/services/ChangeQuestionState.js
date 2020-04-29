import firebase from '../Firebase';

const changeQuestionState = (questionId, state) => {
  firebase.firestore().collection('questions').get().then(resp => {
      let batch = firebase.firestore().batch();
      resp.docs.forEach(userDocRef => {
        if (userDocRef.id === questionId) {
          batch.update(userDocRef.ref, {isOpen: state});
        }else {
          batch.update(userDocRef.ref, {isOpen: false});
        }
      })
      batch.commit().catch(err => console.error(err));
    }).catch(error => console.error(error))
};


export default changeQuestionState;