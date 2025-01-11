import React, { useEffect, useState } from 'react';
import styles from '../../styles/ManagePosts.module.css';

interface ContentItem {
    type: 'text' | 'image' | 'video';
    value: string;
}

interface Post {
    id: number;
    title: string;
    thumbnail_url: string;
    meta_desc: string;
    content: ContentItem[] | string;
    category: string;
}

interface Step {
    id: number; // Unique identifier for the step
    title: string; // Step title
    content: string; // Step content
    video?: string | null; // Optional video URL
    image?: string | null; // Optional image URL
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
    const [expandedFields, setExpandedFields] = useState<Record<number, boolean>>({}); // Tracks expanded state
    const [uploading, setUploading] = useState(false);
    const [editedSteps, setEditedSteps] = useState<Step[]>([]); // State to manage steps

    const TEXT_LIMIT = 50; // Set character limit for "See More"

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
        if (!window.confirm('Are you sure you want to delete this post?')) return;

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
const handleEdit = async (post: Post) => {
    setIsEditing(post.id);
    setEditedPost({ ...post });

    try {
        const response = await fetch(`https://cozytiny.com/api/steps/${post.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch steps');
        }
        const data = await response.json();
        setEditedSteps(data); // Load steps for the post
    } catch (error) {
        console.error('Error fetching steps:', error);
        alert('Failed to fetch steps for this post');
    }
};

    // Save post with updated fields
    const handleSavePost = async () => {
        if (!editedPost) return;

        try {
            // Update the post
            const postResponse = await fetch(`https://cozytiny.com/api/posts/${editedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editedPost.title,
                    meta_desc: editedPost.meta_desc,
                    category: editedPost.category,
                    content: editedPost.content,
                    thumbnail_url: editedPost.thumbnail_url,
                }),
            });

            if (!postResponse.ok) throw new Error('Failed to update post');

            // Update steps
            const stepsResponse = await fetch(`https://cozytiny.com/api/steps/${editedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedSteps),
            });

            if (!stepsResponse.ok) throw new Error('Failed to update steps');

            await fetchPosts(); // Refresh the posts list
            alert('Post and steps updated successfully');
            setIsEditing(null);
            setEditedPost(null);
            setEditedSteps([]);
        } catch (error) {
            console.error('Error updating post or steps:', error);
            alert('Failed to update post or steps');
        }
    };

    // Update fields for the edited post
    const handleFieldChange = (field: keyof Post, value: string) => {
        if (!editedPost) return;
        setEditedPost({ ...editedPost, [field]: value });
    };

    // Update individual step fields
    const handleStepChange = (index: number, field: keyof Step, value: string) => {
        const updatedSteps = [...editedSteps];
        updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        setEditedSteps(updatedSteps);
    };

    // Add a new step
    const addStep = () => {
        setEditedSteps([
            ...editedSteps,
            { id: Date.now(), title: '', content: '', image: null, video: null }, // Add a new step with a unique id
        ]);
    };

    // Handle thumbnail upload
    const handleThumbnailUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('thumbnail', file);

        setUploading(true);

        try {
            const response = await fetch('https://cozytiny.com/api/uploads', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (editedPost) {
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

    const toggleExpanded = (postId: number) => {
        setExpandedFields((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const truncateText = (text: string, limit: number) => {
        return text.length > limit ? text.slice(0, limit) + '...' : text;
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
                        <th>Content</th>
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
                                {isEditing === post.id && (
                                    <div className={styles.stepsEditor}>
                                        <h3>Edit Steps</h3>
                                        {editedSteps.map((step, index) => (
                                            <div key={index} className={styles.stepEditor}>
                                                <input
                                                    type="text"
                                                    placeholder="Step Title"
                                                    value={step.title}
                                                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                                />
                                                <textarea
                                                    placeholder="Step Content"
                                                    value={step.content}
                                                    onChange={(e) => handleStepChange(index, 'content', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Step Image URL"
                                                    value={step.image || ''}
                                                    onChange={(e) => handleStepChange(index, 'image', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Step Video URL"
                                                    value={step.video || ''}
                                                    onChange={(e) => handleStepChange(index, 'video', e.target.value)}
                                                />
                                            </div>
                                        ))}
                                        <button onClick={addStep}>Add Step</button>
                                    </div>
                                )}
                            </td>
                            <td>
                                {post.category}
                            </td>
                            <td>
                                {isEditing === post.id ? (
                                    <>
                                        <button onClick={handleSavePost}>Save</button>
                                        <button onClick={() => setIsEditing(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEdit(post)}>Edit</button>
                                )}
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePostsPage;