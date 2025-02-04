import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Card({ product }) {
    // Handle different possible input structures for favorites
    const productData = product.Product || product;
    
    const { 
        name = 'Unknown Product',
        price = 0, 
        imageUrl = '', 
        description = '', 
        storeName = '', 
        id = null 
    } = productData || {};

    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(imageUrl);

    const fallbackImage = 'https://media.karousell.com/media/photos/products/2024/10/26/baju_anak_perempuan_dress_anak_1729926560_2387613b_progressive.jpg';

    useEffect(() => {
        setImgSrc(imageUrl || fallbackImage);
        
        const checkFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken')
                if (token && id) {
                    const favResponse = await axios.get('http://localhost:3000/favorite', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    const favorites = favResponse.data.favorites
                    const isProductFavorite = favorites.some(fav => fav.Product.id === id)
                    setIsFavorite(isProductFavorite)
                }
            } catch (error) {
                console.error('Error checking favorites:', error);
            }
        }

        checkFavoriteStatus()
    }, [imageUrl, id]);

    async function handleAddToFavorite() {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                navigate('/login')
                return
            }

            if (!id) {
                alert('Invalid product')
                return
            }

            if (isFavorite) {
                // Find the favorite ID to delete
                const favResponse = await axios.get('http://localhost:3000/favorite', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const favorite = favResponse.data.favorites.find(fav => fav.Product.id === id)
                
                if (favorite) {
                    await axios.delete(`http://localhost:3000/favorite/${favorite.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setIsFavorite(false)
                }
            } else {
                await axios.post('http://localhost:3000/favorite', 
                    { ProductId: id }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Error managing favorites:', error);
            alert('Failed to manage favorites')
        }
    }

    if (!id) return null;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="relative overflow-hidden group">
                <img 
                    src={imgSrc} 
                    alt={name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={() => setImgSrc(fallbackImage)}
                />
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                >
                    <Link 
                        to={`/products/${id}`}
                        className="bg-white text-pink-600 px-4 py-2 rounded-md hover:bg-pink-50 transform hover:scale-105 transition-transform"
                    >
                        Quick View
                    </Link>
                </motion.div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
                <p className="text-pink-600 font-bold mb-2">Rp {price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mb-3 line-clamp-1">{storeName}</p>
                <div className="flex justify-between items-center">
                    <Link 
                        to={`/products/${id}`}
                        className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 text-sm transform hover:scale-105 transition-transform"
                    >
                        View Details
                    </Link>
                    <motion.button 
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-2xl transition-colors ${
                            isFavorite 
                            ? 'text-pink-700' 
                            : 'text-pink-400 hover:text-pink-600'
                        }`}
                        onClick={handleAddToFavorite}
                    >
                        {isFavorite ? '★' : '☆'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}