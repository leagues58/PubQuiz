import firebase from '../Firebase';

const registerTeam = ({teamName, email}) => {
  console.log('adding')
  firebase.firestore()
    .collection('teams')
    .add({
      email: email,
      teamName: teamName
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });

};



export default registerTeam;