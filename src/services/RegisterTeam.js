import firebase from '../Firebase';

const registerTeam = async ({teamName, email}) => {
  const ref = await firebase.firestore()
    .collection('teams')
    .add({
      email: email,
      teamName: teamName
    })
    .catch((err) => {
      console.warn('Error saving new team to db', err);
    });
    return ref.id;
};



export default registerTeam;