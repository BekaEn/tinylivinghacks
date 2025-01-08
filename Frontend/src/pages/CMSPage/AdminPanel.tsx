import React from 'react';
import Link from 'next/link';

const AdminPage: React.FC = () => {
    return (
        <div>
            <h1>Admin Panel</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/admin/cmspage">CMS Page</Link>
                    </li>
                    <li>
                        <Link href="/admin/manageposts">Manage Posts</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminPage;