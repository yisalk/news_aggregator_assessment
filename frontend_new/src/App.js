import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import NewsFeed from './pages/NewsFeed';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/news-feed" element={<NewsFeed />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
