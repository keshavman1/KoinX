import React from 'react';
import logo from './logo.png'; // Import your logo image

function Navbar() {
  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="mr-2 h-8" /> {/* Adjust logo height as needed */}
          <span className="font-bold text-lg">Crypto Converter</span>
        </a>
        <ul className="flex space-x-4">
          <li className="nav-item">
            <a href="/about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
