import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors ${className}`}>
            {children}
        </div>
    );
};

export default Card;
