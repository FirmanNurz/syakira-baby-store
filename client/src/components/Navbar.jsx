import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUserProfile(null);
        
        window.dispatchEvent(new Event('authStateChanged'));
        
        navigate('/login');
    };

    useEffect(() => {
        // Function to update access token and fetch user profile
        const updateAccessToken = async () => {
            const token = localStorage.getItem('accessToken');
            setAccessToken(token);

            if (token) {
                try {
                    const { data } = await axios.get('http://localhost:3000/user/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(data.user);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    // If profile fetch fails, clear the token
                    localStorage.removeItem('accessToken');
                    setAccessToken(null);
                }
            }
        };

        // Add event listener for auth state changes
        window.addEventListener('authStateChanged', updateAccessToken);

        // Initial token check
        updateAccessToken();

        return () => {
            window.removeEventListener('authStateChanged', updateAccessToken);
        };
    }, []);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-pink-600">Syakira Baby Store</span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md">
                            Home
                        </Link>
                        {accessToken && (
                            <Link to="/favorites" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md">
                                Favorites
                            </Link>
                        )}

                        {accessToken ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md">
                                    <img 
                                        src={userProfile?.picture || 'https://png.pngtree.com/png-clipart/20240709/original/pngtree-casual-man-flat-design-avatar-profile-picture-vector-png-image_15526568.png'} 
                                        alt="Profile" 
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="text-gray-700">{userProfile?.name || 'Profile'}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="border border-pink-600 text-pink-600 px-4 py-2 rounded-md hover:bg-pink-50 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}