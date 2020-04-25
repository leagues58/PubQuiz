import React from 'react';
import {Switch, Route} from 'react-router-dom';

import SignIn from './pages/SignIn';
import Play from './pages/Play';
import Cockpit from './pages/Cockpit';


const App = () => {
  return (
    <Switch>
      <Route exact path='/' component={SignIn} />
      <Route path='/play/:id' component={Play} />
      <Route path='/cockpit' component={Cockpit} />
    </Switch>
  );
}

export default App;
