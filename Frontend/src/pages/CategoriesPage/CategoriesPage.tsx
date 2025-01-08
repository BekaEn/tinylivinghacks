import React from 'react';
import { categories } from '../../utils/categories';

const CategoriesPage: React.FC = () => {
    return (
        <div>
            <h1>Categories</h1>
            <ul>
                {categories.map((category) => (
                    <li key={category.name}>
                        <a href={category.link}>{category.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoriesPage;