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
    const [editedPost, setEditedPost] = useState<Post | null>(null);
    const [uploading, setUploading] = useState(false); // Track upload status

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const response = await fetch('https://cozytiny.com/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Delete post
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`https://cozytiny.com/api/posts/${id}`, {
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

    // Edit post
    const handleEdit = (post: Post) => {
        setIsEditing(post.id);
        setEditedPost({ ...post });
    };

    // Save post with updated fields
    const handleSavePost = async () => {
        if (!editedPost) return;
    
        try {
            console.log('Saving post with data:', {
                title: editedPost.title,
                meta_desc: editedPost.meta_desc,
                category: editedPost.category,
                thumbnail_url: editedPost.thumbnail_url, // Log the thumbnail URL
            });
    
            const response = await fetch(`https://cozytiny.com/api/posts/${editedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editedPost.title,
                    meta_desc: editedPost.meta_desc,
                    category: editedPost.category,
                    thumbnail_url: editedPost.thumbnail_url, // Ensure this is sent
                }),
            });
    
            if (response.ok) {
                await fetchPosts(); // Refresh the posts list
                alert('Post updated successfully');
                setIsEditing(null);
                setEditedPost(null);
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Update fields for the edited post
    const handleFieldChange = (field: keyof Post, value: string) => {
        if (!editedPost) return;
        setEditedPost({ ...editedPost, [field]: value });
    };

    // Handle thumbnail upload
    const handleThumbnailUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        setUploading(true);

        try {
            // Upload the thumbnail to the server
            const response = await fetch('https://cozytiny.com/api/uploads', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (editedPost) {
                    // Update the thumbnail URL in the edited post state
                    setEditedPost({ ...editedPost, thumbnail_url: data.thumbnail_url });
                    alert('Thumbnail uploaded successfully');
                }
            } else {
                alert('Failed to upload thumbnail');
            }
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
        } finally {
            setUploading(false);
        }
    };

    // Fetch posts on component mount
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
                            <td>
                                {isEditing === post.id ? (
                                    <input
                                        type="text"
                                        value={editedPost?.title || ''}
                                        onChange={(e) => handleFieldChange('title', e.target.value)}
                                    />
                                ) : (
                                    post.title
                                )}
                            </td>
                            <td>
                                {isEditing === post.id ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    handleThumbnailUpload(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        {uploading && <p>Uploading...</p>}
                                        {editedPost?.thumbnail_url && (
                                            <img
                                                src={`http://cozytiny.com${editedPost.thumbnail_url}`}
                                                alt="Thumbnail Preview"
                                                className={styles.thumbnail}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <img
                                        src={`http://cozytiny.com${post.thumbnail_url}`}
                                        alt="Thumbnail"
                                        className={styles.thumbnail}
                                    />
                                )}
                            </td>
                            <td>
                                {isEditing === post.id ? (
                                    <textarea
                                        value={editedPost?.meta_desc || ''}
                                        onChange={(e) => handleFieldChange('meta_desc', e.target.value)}
                                    />
                                ) : (
                                    post.meta_desc
                                )}
                            </td>
                            <td>
                                {isEditing === post.id ? (
                                    <select
                                        value={editedPost?.category || ''}
                                        onChange={(e) => handleFieldChange('category', e.target.value)}
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
                                            onClick={handleSavePost}
                                            className={styles.saveButton}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(null);
                                                setEditedPost(null);
                                            }}
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