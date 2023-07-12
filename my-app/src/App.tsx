import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatContainer from './components/ChatContainer';
import './style/ChatStyle.css';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './components/FrontPage';

function App() {
  return (
    <div className='container'>
    <Routes>
      <Route path='/' element={<FrontPage></FrontPage>}></Route>
      <Route path='/chat' element={<ChatContainer></ChatContainer>}></Route>
    </Routes>
      
    </div>
  );
}

export default App;
