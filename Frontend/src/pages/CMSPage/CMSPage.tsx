import React, { useState } from 'react';
import styles from '../../styles/CMSPage.module.css';
import { categories } from '../../utils/categories';

const CMSPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [metaDescription, setMetaDescription] = useState('');
    const [steps, setSteps] = useState<
        { title: string; content: string; video: string; image: string | null }[]
    >([]);
    const [category, setCategory] = useState(categories[0].name);

    const handleAddStep = () => {
        setSteps([...steps, { title: '', content: '', video: '', image: null }]);
    };

    const handleStepChange = (
        index: number,
        field: 'title' | 'content' | 'video' | 'image',
        value: string | File
    ) => {
        const updatedSteps = [...steps];
        if (field === 'image' && value instanceof File) {
            const formData = new FormData();
            formData.append('image', value);
            fetch('/api/posts/upload-image', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    updatedSteps[index].image = data.filePath;
                    setSteps(updatedSteps);
                })
                .catch((error) => console.error('Error uploading image:', error));
        } else {
            updatedSteps[index][field] = value as string;
            setSteps(updatedSteps);
        }
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setThumbnail(file || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!thumbnail) {
            alert('Please upload a thumbnail!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('meta_desc', metaDescription);
        formData.append('category', category);
        formData.append('thumbnail', thumbnail);
        formData.append('steps', JSON.stringify(steps));

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Post added successfully!');
                setTitle('');
                setThumbnail(null);
                setMetaDescription('');
                setSteps([]);
                setCategory(categories[0].name);
            } else {
                const errorData = await response.json();
                console.error('Failed to add post:', errorData);
                alert(errorData.error || 'Failed to add post.');
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    return (
        <div className={styles.cmsContainer}>
            <h1>CMS Page</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Post Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Thumbnail:</label>
                    <input type="file" onChange={handleThumbnailUpload} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Meta Description:</label>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepsContainer}>
                    <h3>Steps:</h3>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <input
                                type="text"
                                placeholder="Step Title"
                                value={step.title}
                                onChange={(e) =>
                                    handleStepChange(index, 'title', e.target.value)
                                }
                            />
                            <textarea
                                placeholder="Step Content"
                                value={step.content}
                                onChange={(e) =>
                                    handleStepChange(index, 'content', e.target.value)
                                }
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Video URL"
                                value={step.video}
                                onChange={(e) =>
                                    handleStepChange(index, 'video', e.target.value)
                                }
                            />
                            <input
                                type="file"
                                onChange={(e) =>
                                    e.target.files && handleStepChange(index, 'image', e.target.files[0])
                                }
                            />
                            {step.image && <img src={step.image} alt="Step Image" />}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddStep} className={styles.addStepButton}>
                        Add Step
                    </button>
                </div>

                <button type="submit" className={styles.submitButton}>Submit Post</button>
            </form>
        </div>
    );
};

export default CMSPage;