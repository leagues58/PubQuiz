import React from 'react';
import Header from '../components/login/Header';
import LoginForm from '../components/login/LoginForm';
import Background from '../bulb.jpg';

const SignIn = () => {
  //document.body.style = 'background: #282c34';
  return (
    <div style={{display: 'flex', flexDirection: 'column', backgroundImage:`url(${Background})`}}>
      <Header />
      <LoginForm />
    </div>
  );
};


export default SignIn;