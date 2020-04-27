import React from 'react';
import Header from '../components/login/Header';
import LoginForm from '../components/login/LoginForm';

const SignIn = () => {
  //document.body.style = 'background: #282c34';
  return (
    <div style={{display: 'flex', flexDirection: 'column',  marginTop:'5vh'}}>
      <Header />
      <LoginForm />
    </div>
  );
};


export default SignIn;