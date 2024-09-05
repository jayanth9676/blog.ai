import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import About from './components/About';
import Contact from './components/Contact';
import { ThemeProvider } from './ThemeContext';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <div className="content-wrapper">
                        <Routes>
                            <Route path="/" element={<PostList />} />
                            <Route path="/posts/:id" element={<PostDetail />} />
                            <Route path="/posts/new" element={<PostForm />} />
                            <Route path="/posts/:id/edit" element={<PostForm />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;