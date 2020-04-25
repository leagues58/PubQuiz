const isValidEmail = (email) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return false;
};

const isValidTeamName = (name) => {
  if (name && name !== '' && name.length < 100) {
    return true;
  }
  return false;
};


export {isValidEmail, isValidTeamName}