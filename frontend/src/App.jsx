import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
  );
}

export default App;
