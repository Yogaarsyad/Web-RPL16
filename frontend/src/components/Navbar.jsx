import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Navbar komponen dengan logo dan tombol login.
function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Diamond Animated */}
        <Link to="/" className="flex items-center">
          <svg
            className="diamond w-8 h-8 mr-3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
          >
            <title>LifeMon</title>
            <path d="M12 2 L19 9 L12 22 L5 9 Z" />
          </svg>

          <span className="text-2xl font-bold select-none">LifeMon</span>
        </Link>

        {/* Tombol Login / Profil */}
        <div className="flex items-center space-x-3">
          <Link to="/login">
            <button className="px-4 py-2 rounded-md bg-white text-primary font-semibold text-sm">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;