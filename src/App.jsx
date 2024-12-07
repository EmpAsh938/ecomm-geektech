import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdAddShoppingCart, MdDelete } from "react-icons/md";

function App() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        // Fetch categories and products from API
        fetch("https://dummyjson.com/products")
            .then((res) => res.json())
            .then((data) => {
                const uniqueCategories = [
                    "All",
                    ...new Set(data.products.map((product) => product.category)),
                ];
                setCategories(uniqueCategories);
                setProducts(data.products);
            })
            .catch((error) => console.error("Error fetching products:", error))
            .finally(() => setLoading(false)); // Set loading to false after fetch
    }, []);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex(
                (item) => item.id === product.id
            );
            if (existingProductIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex].quantity += 1;
                return updatedCart;
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const toggleCartModal = () => {
        setIsCartOpen(!isCartOpen);
    };

    const getTotalPrice = () =>
        cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const filterProductsByCategory = (category) => {
        setActiveCategory(category);
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        setCart(updatedCart);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCart(updatedCart);
        }
    };

    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const filteredProducts = products.filter((product) => {
        const isCategoryMatch =
            activeCategory === "All" || product.category === activeCategory;
        const isSearchMatch =
            product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return isCategoryMatch && isSearchMatch;
    });

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {/* Header */}
            <header className="sticky top-0 shadow-md px-6 py-4 flex justify-between items-center bg-white z-10">
                <div className="text-3xl font-bold text-blue-600 hidden md:block">EPasal</div>
                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        className="relative text-2xl text-gray-800"
                        onClick={toggleCartModal}
                    >
                        <FaShoppingCart />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cart.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                    <button className="text-2xl text-gray-800">
                        <FaUserCircle />
                    </button>
                </div>
            </header>

            {/* Categories */}
            <nav className="bg-white py-3 px-6 flex gap-3 overflow-x-auto shadow-sm">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded-2xl text-sm capitalize font-medium ${activeCategory === category
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                            } border border-gray-300 transition`}
                        onClick={() => filterProductsByCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </nav>

            {/* Product Grid */}
            <main className="p-6 bg-gray-100">
                {loading ? (
                    <div className="text-center text-gray-500">Loading products...</div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md p-4 text-center border hover:shadow-lg transition"
                            >
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-36 h-36 object-cover mx-auto mb-4 rounded-md"
                                />
                                <h3 className="text-sm text-gray-800 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {product.title}
                                </h3>
                                <p className="font-bold text-gray-800 text-sm mb-3">Rs. {product.price}</p>
                                <button
                                    className="flex items-center gap-1 mx-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                    onClick={() => addToCart(product)}
                                >
                                    <MdAddShoppingCart />
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No products found.</p>
                )}
            </main>

            {/* Cart Modal */}
            {isCartOpen && (
                <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-20">
                    <div className="p-4 flex flex-col h-full relative">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Cart</h2>
                            <button
                                onClick={toggleCartModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>

                        {cart.length > 0 ? (
                            <div className="space-y-4 overflow-y-auto flex-grow">
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 border rounded-lg p-3"
                                    >
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div className="flex-grow ml-4">
                                            <h3 className="">{item.title}</h3>
                                            <p className="text-sm font-semibold">Rs. {item.price}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                onClick={() => increaseQuantity(index)}
                                                className="text-green-600 hover:bg-green-100 p-1 rounded"
                                            >
                                                <FaAngleUp />
                                            </button>
                                            <button
                                                onClick={() => decreaseQuantity(index)}
                                                className="text-yellow-600 hover:bg-yellow-100 p-1 rounded"
                                            >
                                                <FaAngleDown />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-600 hover:bg-red-100 p-1 rounded"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">Your cart is empty.</p>
                        )}

                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center font-semibold text-lg">
                                <span>Total:</span>
                                <span>Rs. {getTotalPrice()}</span>
                            </div>
                            <button
                                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
