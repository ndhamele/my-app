import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';

function App() {
  return (
    <Router>
        <Route exact path="/" component={Registration} />
        <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
