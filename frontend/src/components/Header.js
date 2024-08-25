import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleDarkMode, darkMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="logo-container">
                    <Link to="/" className="logo-link">
                        <svg className="logo" width="120" height="40" viewBox="0 0 120 40">
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ff00cc" />
                                    <stop offset="100%" stopColor="#3333ff" />
                                </linearGradient>
                            </defs>
                            <text x="5" y="30" fontSize="24" fontWeight="bold" fill="url(#gradient)">Blog.AI</text>
                            <circle cx="100" cy="20" r="15" fill="url(#gradient)">
                                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    </Link>
                </div>
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={toggleMenu} className="nav-button">Home</Link></li>
                        <li><Link to="/posts/new" onClick={toggleMenu} className="nav-button">New Post</Link></li>
                    </ul>
                </nav>
                <div className="header-actions">
                    <button className="toggle-dark-mode" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                        <div className="toggle-switch">
                            <div className={`toggle-slider ${darkMode ? 'dark' : ''}`}>
                                <i className="fas fa-sun"></i>
                                <i className="fas fa-moon"></i>
                            </div>
                        </div>
                    </button>
                    <div className="hamburger-menu" onClick={toggleMenu}>
                        <i className="fas fa-bars"></i>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;