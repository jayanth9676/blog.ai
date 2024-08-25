import React from 'react';

const TableOfContents = ({ subTopics }) => {
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="table-of-contents">
            <h3>Contents</h3>
            <ul>
                {subTopics.map((topic, index) => (
                    <li key={index}>
                        <a
                            href={`#subtopic-${index}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToHeading(`subtopic-${index}`);
                            }}
                        >
                            {topic}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableOfContents;