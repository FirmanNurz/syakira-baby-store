import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)

    async function fetchData() {
        try {
            setLoading(true)
            const {data} = await axios.get(`http://localhost:3000/products/${id}`)
    
            setProduct(data.product)
            
            // Check if product is already in favorites
            const token = localStorage.getItem('accessToken')
            if (token) {
                const favResponse = await axios.get('http://localhost:3000/favorite', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const favorites = favResponse.data.favorites
                const isProductFavorite = favorites.some(fav => fav.productId === data.product.id)
                setIsFavorite(isProductFavorite)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleAddToFavorites = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                alert('Please login first')
                return
            }

            if (isFavorite) {
                // Find the favorite ID to delete
                const favResponse = await axios.get('http://localhost:3000/favorite', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const favorite = favResponse.data.favorites.find(fav => fav.productId === product.id)
                
                if (favorite) {
                    await axios.delete(`http://localhost:3000/favorite/${favorite.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setIsFavorite(false)
                }
            } else {
                await axios.post('http://localhost:3000/favorite', 
                    { productId: product.id }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Error managing favorites:', error);
            alert('Failed to manage favorites')
        }
    }

    if (loading) return <div>Loading...</div>

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl text-gray-600"
                >
                    Product not found
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative group">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = 'https://media.karousell.com/media/photos/products/2024/10/26/baju_anak_perempuan_dress_anak_1729926560_2387613b_progressive.jpg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col justify-center"
                >
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-gray-800 mb-4"
                    >
                        {product.name}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-600 mb-6 text-lg"
                    >
                        {product.description}
                    </motion.p>
                    
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-pink-50 p-6 rounded-xl mb-6"
                    >
                        <p className="text-3xl font-bold text-pink-600">
                            Rp {product.price}
                        </p>
                        <p className="text-pink-500 mt-1">
                            Stock: {product.stock} items available
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white p-6 rounded-xl shadow-sm mb-6"
                    >
                        <h2 className="font-semibold text-gray-800 mb-3">Store Information</h2>
                        <p className="text-gray-700 font-medium">{product.storeName}</p>
                        <p className="text-gray-600 mt-1">{product.address}</p>
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex gap-4"
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 px-6 py-3 rounded-xl transition-colors font-semibold ${
                                isFavorite 
                                ? 'bg-pink-200 text-pink-800' 
                                : 'bg-pink-600 text-white hover:bg-pink-700'
                            }`}
                            onClick={handleAddToFavorites}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-xl border-2 border-pink-600 text-pink-600 hover:bg-pink-50 transition-colors font-semibold"
                        >
                            Share
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}