import firebase from '../Firebase';

const registerTeam = async ({teamName, email, password, number}) => {
  const ref = await firebase.firestore()
    .collection('teams')
    .add({
      email: email,
      teamName: teamName,
      password: password,
      number: number
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });
    return ref.id;
};



export default registerTeam;