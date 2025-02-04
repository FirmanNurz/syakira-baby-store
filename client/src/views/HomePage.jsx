import Card from '../components/Card';
import { motion } from 'framer-motion';
import Recommendation from '../components/Recommendation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/products-slice';

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

export default function HomePage() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {/* Hero Banner */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[500px] bg-gradient-to-r from-pink-100 to-purple-100"
            >
                <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/baby-clothes-accessories_23-2147663845.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                    <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl"
                    >
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Welcome to Syakira Baby Store
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Discover our adorable collection of baby clothes, designed for comfort and style
                        </p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition-colors"
                        >
                            Shop Now
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            <Recommendation />

            {/* Categories */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-center text-gray-800 mb-12"
                    >
                        Popular Categories
                    </motion.h2>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {['Romper', 'Dress', 'Set Muslim', 'Accessories'].map((category, index) => (
                            <motion.div
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Products */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-center text-gray-800 mb-12"
                    >
                        Our Latest Collection
                    </motion.h2>
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {products.length > 0 && products?.map((product) => (
                            <motion.div key={product.id} variants={item}>
                                <Card product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { title: 'Free Shipping', desc: 'On orders over Rp 500.000' },
                            { title: 'Premium Quality', desc: 'Handpicked products' },
                            { title: 'Best Prices', desc: 'Direct from manufacturers' }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                whileHover={{ y: -5 }}
                                className="text-center p-6"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}