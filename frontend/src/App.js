import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Router>
            <AppContent toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </Router>
    );
}

function AppContent({ toggleDarkMode, darkMode }) {
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        setSelectedCategory(category);
    }, [location]);

    return (
        <div className="App">
            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<PostList selectedCategory={selectedCategory} />} />
                    <Route path="/posts/new" element={<PostForm />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/:id/edit" element={<PostForm />} />
                </Routes>
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default App;