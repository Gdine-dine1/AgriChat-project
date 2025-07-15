import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductForm from '../components/AddProductForm';
import { motion, AnimatePresence } from 'framer-motion';

function MarketPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowForm(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditProduct(null);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleContactClick = (farmer) => {
    setSelectedFarmer(farmer);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-800">🛒 Agri Market</h1>

      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => {
            setEditProduct(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? 'Close Form' : '➕ Add Product'}
        </button>
      </div>

      <AnimatePresence>
        {(showForm || editProduct) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <AddProductForm
              initialData={editProduct}
              isEdit={!!editProduct}
              onProductAdded={handleProductAdded}
              onProductUpdated={handleProductUpdated}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const isOwner = user?.id === product.farmer?._id;
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
            >
              {product.imageUrl && (
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}
              <h2 className="text-lg font-bold text-green-700">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-700">
                Price: <strong>KES {product.price}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Farmer: {product.farmer?.username || 'Unknown'}
              </p>

              {isOwner ? (
                <div className="mt-3 space-y-2">
                  <button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setEditProduct(product);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(product._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <button
                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleContactClick(product.farmer)}
                >
                  Contact Farmer
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Contact Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Contact {selectedFarmer.username}
            </h2>
            <p className="text-gray-700 mb-2">
              Email:{' '}
              <strong>{selectedFarmer.email || 'Not available'}</strong>
            </p>
            {selectedFarmer.email && (
              <a
                href={`mailto:${selectedFarmer.email}`}
                className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center mb-2"
              >
                Send Email
              </a>
            )}
            <button
              onClick={() => setSelectedFarmer(null)}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketPage;
