import React from 'react';

const AuthorForm = ({ author, onUpdate, disabled }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...author, [name]: value });
    };

    return (
        <div className="author-form">
            <h3>Author Information</h3>
            <div className="form-group">
                <label htmlFor="authorName">Name</label>
                <input
                    type="text"
                    id="authorName"
                    name="name"
                    value={author.name}
                    onChange={handleChange}
                    disabled={disabled}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="authorEmail">Email</label>
                <input
                    type="email"
                    id="authorEmail"
                    name="email"
                    value={author.email}
                    onChange={handleChange}
                    disabled={disabled}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="authorBio">Bio</label>
                <textarea
                    id="authorBio"
                    name="bio"
                    value={author.bio}
                    onChange={handleChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default AuthorForm;