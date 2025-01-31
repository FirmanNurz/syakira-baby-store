import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Recommendations() {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get('https://firmanz.tech/products/gemini');
                // Flatten all products from all categories into a single array
                const allProducts = response.data.text.products.flatMap(category => category.items);
                
                // Get 3 random products from the flattened array
                const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
                
                setRecommendedProducts(selected);
                setTitle(response.data.text.recommendation);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Failed to fetch recommendations');
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-white to-pink-50 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    Loading recommendations...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-b from-white to-pink-50 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-white to-pink-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {title}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover more adorable items handpicked just for you
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {recommendedProducts.map((product) => (
                        <motion.div key={product.id} variants={item}>
                            <Card product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition-colors"
                    >
                        View More
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}