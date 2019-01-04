import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';

const authorized = isLoggedIn();

const ProtectedRoute = ({...props }) => {
 return authorized
     ? <Route {...props}/>
   : <Redirect to="/"/>;
}

const HomeRoute = ({...props }) => {
 return authorized
     ? <Redirect to="/dashboard"/>
   : <Route {...props}/>;
}

const Main = () => (
  <main>
  <Switch>
    <HomeRoute exact path='/' component={Home}/>
    <ProtectedRoute exact path='/dashboard' component={Dashboard}/>
  </Switch>
  </main>
)

function isLoggedIn() {
  if (localStorage.token) {
    return true;
  } else {
    return false;
  }
}


export default Main;
