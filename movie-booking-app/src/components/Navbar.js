import React from 'react';
import '../styles/index.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Movie Booking</div>
      <ul className="navbar-links">
        <li>
          <a href="/movies">Movies</a>
        </li>
        <li>
          <a href="/booking-history">Booking History</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
