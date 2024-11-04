import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import BookingHistory from './components/BookingHistory';
import Navbar from './components/Navbar';
import './styles/index.css';
import BookingSuccess from './components/BookingSuccess';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/movies" />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
