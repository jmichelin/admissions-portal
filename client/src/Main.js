import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Dashboard from './pages/dashboard/Dashboard'


const Main = () => (
  <main>
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/dashboard' component={Dashboard}/>
  </Switch>
  </main>
)

export default Main;
