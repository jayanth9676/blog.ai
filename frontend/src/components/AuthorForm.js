import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthorForm = ({ author, onUpdate, disabled }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            name: author.name || '',
            email: author.email || '',
            bio: author.bio || ''
        });
    }, [author]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="author-form">
            <div className="form-group">
                <label htmlFor="authorName">Author Name</label>
                <input
                    type="text"
                    id="authorName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={disabled}
                    required
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="authorEmail">Author Email</label>
                <input
                    type="email"
                    id="authorEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={disabled}
                    required
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="authorBio">Author Bio</label>
                <textarea
                    id="authorBio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={disabled}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={disabled}>
                Update Author
            </button>
        </form>
    );
};

AuthorForm.propTypes = {
    author: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        bio: PropTypes.string
    }),
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

AuthorForm.defaultProps = {
    author: {},
    disabled: false
};

export default AuthorForm;