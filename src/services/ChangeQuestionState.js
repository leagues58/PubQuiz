import firebase from '../Firebase';

const changeQuestionState = (questionId, state) => {
  //firebase.firestore().collection('questions').doc(questionId).update({open: state});
  firebase.firestore().collection('questions').get().then(resp => {
      let batch = firebase.firestore().batch();
      resp.docs.forEach(userDocRef => {
        console.log('ref: ' + userDocRef.id + ' ' + questionId)
        if (userDocRef.id === questionId) {
          batch.update(userDocRef.ref, {open: state});
        }else {
          batch.update(userDocRef.ref, {open: false});
        }
      })
      batch.commit().catch(err => console.error(err));
    }).catch(error => console.error(error))
};


export default changeQuestionState;