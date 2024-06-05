import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/news">Actualités</Link></li>
        <li><Link to="/events">Événements</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
