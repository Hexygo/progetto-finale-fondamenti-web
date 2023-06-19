import './App.css';
import Login from './pages/Login';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [loggedUser, setLoggedUser]=useState()

  return (
      <Routes>
        <Route path="/" element={<Login setLoggedUser={setLoggedUser}/>}/>
        <Route path="/home" element={<Home loggedUser={loggedUser}/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
  );
}

export default App;
