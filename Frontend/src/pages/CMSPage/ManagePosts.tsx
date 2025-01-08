import React, { useEffect, useState } from 'react';
import styles from '../../styles/ManagePosts.module.css';

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    content: string;
    category: string; // Include category
}

const categories = [
    'Design & Inspiration',
    'Building & Construction',
    'Eco-Living Tips',
    'Furniture & Storage',
    'Lifestyle & Wellness',
    'Uncategorized',
];

const ManagePostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedCategory, setEditedCategory] = useState<string>(''); // For category editing

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://cozytiny.com/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://cozytiny.com/api/posts/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== id));
                alert('Post deleted successfully');
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEdit = (post: Post) => {
        setIsEditing(post.id);
        setEditedCategory(post.category); // Set initial category for editing
    };

    const handleSaveCategory = async (id: number) => {
        try {
            const response = await fetch(`http://cozytiny.com/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: editedCategory }), // Only update the category
            });
            if (response.ok) {
                await fetchPosts();
                alert('Category updated successfully');
                setIsEditing(null);
            } else {
                alert('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className={styles.managePostsContainer}>
            <h1>Manage Posts</h1>
            <table className={styles.postTable}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Thumbnail</th>
                        <th>Meta Description</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.title}</td>
                            <td>
                                <img
                                    src={`http://cozytiny.com${post.thumbnail_url}`}
                                    alt="Thumbnail"
                                    className={styles.thumbnail}
                                />
                            </td>
                            <td>{post.meta_desc}</td>
                            <td>
                                {isEditing === post.id ? (
                                    <select
                                        value={editedCategory}
                                        onChange={(e) => setEditedCategory(e.target.value)}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    post.category
                                )}
                            </td>
                            <td>
                                {isEditing === post.id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveCategory(post.id)}
                                            className={styles.saveButton}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(null)}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePostsPage;