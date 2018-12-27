import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './pages/home/Home'
import Dashboard from './pages/dashboard/Dashboard'

const ProtectedRoute = ({...props }) => {
 const isAllowed = isLoggedIn()
 return isAllowed
     ? <Route {...props}/>
   : <Redirect to="/"/>;
}

const HomeRoute = ({...props }) => {
 const isAllowed = isLoggedIn()
 return isAllowed
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
