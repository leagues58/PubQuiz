import React from 'react';
//import logo from './stillwater_logo.jpg';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src='logo.png' className="logo" alt="logo" />
        
        <div className="header-text">Stillwater Pub Quiz!</div>
        <div className="subheader-text">(Now Virtual!)</div>
      </header>

      <div className="signup-form">
        <form onSubmit={()=>{return null}}>
          <label>
            Team Name:
            <input type="text" value={''} onChange={()=>{return null}} />
          </label>
          <input type="submit" value="Submit" />
        </form>

      </div>
    </div>
  );
}

export default App;
