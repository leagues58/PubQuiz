import firebase from '../Firebase';

const registerTeam = async ({teamName, email, password}) => {
  const ref = await firebase.firestore()
    .collection('teams')
    .add({
      email: email,
      teamName: teamName,
      password: password
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });
    return ref.id;
};



export default registerTeam;