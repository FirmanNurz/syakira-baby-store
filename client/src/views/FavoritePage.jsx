import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';

export default function FavoritePage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchFavorites() {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:3000/favorite', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setFavorites(data.favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError('Failed to load favorites. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, []);

    console.log(favorites,"favorites");
    

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Favorites</h1>
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Favorites</h1>
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Favorites</h1>
            {favorites.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No favorite items yet.</p>
                    <a 
                        href="/"
                        className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
                    >
                        Browse Products
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                        <Card key={favorite.id} product={favorite} />
                    ))}
                </div>
            )}
        </div>
    );
}