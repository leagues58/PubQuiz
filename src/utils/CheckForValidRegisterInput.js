const defaultValidationObject = {
  teamNameError: false, teamNameHelperText: '',
  emailError: false, emailHelperText: '',
  passwordError: false, passwordHelperText: ''
};

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

const isValidPassword = (password) => {
  if (password && password !== '' && password.length < 100) {
    return true;
  }
  return false;
};

const validateRegistration = ({teamName, email, password}) => {
  let errors = {teamNameError: true, emailError: true, passwordError: true};

  if (isValidTeamName(teamName)) {
    errors.teamNameError = false;
  } else {
    errors.teamNameHelperText = 'Please provide a team name. 100 characters max.';
  }
  if (isValidEmail(email)) {
    errors.emailError = false;
  } else {
    errors.emailHelperText = 'Please provide a valid email address.';
  }
  if (isValidPassword(password)) {
    errors.passwordError = false;
  } else {
    errors.passwordHelperText = 'Please enter a password for your team\'s room.  100 characters max.';
  }

  return errors;
};



export {validateRegistration, defaultValidationObject};