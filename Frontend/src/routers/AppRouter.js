import React from 'react';
import {BrowserRouter, Route, Switch, Link, NavLink} from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';
import Test from '../components/Test';

const AppRouter=()=>(
    <BrowserRouter >
    <div>
    <Header title='G3-COVID19-Monitor'></Header>
      <Switch>
      <Route path="/" component={Home} exact={true}/>
      <Route path="/prueba" component={Test}/>
      </Switch> 
    </div>
    </BrowserRouter>
);

export default AppRouter;