import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const { data } = await axios.get('https://firmanz.tech/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(data.user);
                setPreviewImage(data.user.picture);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            
            if (selectedFile) {
                formData.append('picture', selectedFile);
            }

            const { data } = await axios.patch(
                'https://firmanz.tech/user/update-image', 
                formData, 
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Dispatch event to update navbar
            window.dispatchEvent(new Event('authStateChanged'));

            // Update local user state
            setUser(prevUser => ({ ...prevUser, picture: data.picture }));
            setSelectedFile(null);
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="h-24 w-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-300 w-48 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 w-32 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-8">
                <div className="text-center">
                    <div className="mb-6">
                        <img 
                            src={previewImage || user.picture} 
                            alt="Profile" 
                            className="h-32 w-32 rounded-full mx-auto object-cover border-4 border-pink-600"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                    <p className="text-gray-600 mb-6">{user.email}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label 
                                htmlFor="profile-picture" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Change Profile Picture
                            </label>
                            <input 
                                type="file" 
                                id="profile-picture"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-pink-50 file:text-pink-700
                                    hover:file:bg-pink-100"
                            />
                        </div>

                        {selectedFile && (
                            <button
                                type="submit"
                                className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
                            >
                                Save Profile Picture
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
