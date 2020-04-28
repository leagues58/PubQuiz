import React from 'react';
import Header from '../components/login/Header';
import LoginForm from '../components/login/LoginForm';
import Background from '../bulb.jpg';

const SignIn = () => {
  //document.body.style = 'background: #282c34';
  return (
    <div style={{flexDirection: 'column', backgroundImage:`url(${Background})`, height: '100%', border:'1px solid red'}}>
      <Header />
      <LoginForm />
    </div>
  );
};


export default SignIn;