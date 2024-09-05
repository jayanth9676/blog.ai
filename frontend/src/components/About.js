import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="page-content">
            <h1 className="page-title">About Blog.AI</h1>
            <div className="about-content">
                <p>Welcome to Blog.AI, a cutting-edge blogging platform that leverages artificial intelligence to enhance the writing and reading experience.</p>
                <p>Our mission is to provide a space where technology and creativity intersect, allowing writers to express their ideas and readers to discover engaging content.</p>
                <h2>Meet the Developer</h2>
                <div className="developer-info">
                    <div className="developer-header">
                        <div className="developer-avatar">
                            <img src="/profile_photo.jpg" alt="Jayanth" />
                        </div>
                        <div className="developer-name">
                            <h3>Jayanth Thallapelli</h3>
                            <p>Full-stack developer passionate about AI and web technologies.</p>
                        </div>
                    </div>
                    <div className="social-links">
                        <a href="https://github.com/jayanth9676" target="_blank" rel="noopener noreferrer" className="social-btn github">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/jayanth-thallapelli" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="https://x.com/jthallapelli" target="_blank" rel="noopener noreferrer" className="social-btn twitter">
                            <i className="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="https://leetcode.com/u/jayanth_goud369/" target="_blank" rel="noopener noreferrer" className="social-btn leetcode">
                            <i className="fas fa-code"></i> LeetCode
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;