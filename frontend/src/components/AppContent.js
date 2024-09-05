import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostList from './PostList';
import PostForm from './PostForm';
import PostDetail from './PostDetail';
import About from './About';
import Contact from './Contact';

const AppContent = () => {
    return (
        <div className="page-content">
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts/:id/edit" element={<PostForm />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
    );
};

export default AppContent;