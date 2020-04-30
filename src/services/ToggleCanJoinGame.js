import firebase from '../Firebase';

const ToggleCanJoinGame = async (canJoinGame) => {
  firebase.firestore()
    .collection('settings')
    .get()
    .then((snapshot) => {
      snapshot.forEach(doc => {
        firebase.firestore()
        .collection('settings')
        .doc(doc.id)
        .update({canJoinGame});
      })
    });


};


export default ToggleCanJoinGame;