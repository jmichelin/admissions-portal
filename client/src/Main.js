import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'

const Main = () => (
  <main>
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/signup' component={Signup}/>
  </Switch>
  </main>
)

export default Main;