import firebase from '../Firebase';

const getTeam = async (id) => {
  const doc = await firebase.firestore()
    .collection('teams')
    .doc(id)
    .get();

  return doc.data();

};



export default getTeam;